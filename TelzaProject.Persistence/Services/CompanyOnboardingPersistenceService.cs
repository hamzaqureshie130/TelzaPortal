using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Features.Kyc.Commands.SubmitKycApplication;
using TelzaProject.Domain.Entities;
using TelzaProject.Persistence.Identity;

namespace TelzaProject.Persistence.Services
{
    public class CompanyOnboardingPersistenceService : ICompanyOnboardingPersistenceService
    {
        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        private readonly TelzaPortalDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CompanyOnboardingPersistenceService(TelzaPortalDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task SaveAsync(SubmitKycApplicationCommand command, CancellationToken cancellationToken = default)
        {
            var userId = command.UserId;
            if (string.IsNullOrWhiteSpace(userId) || userId.StartsWith("guest-", StringComparison.OrdinalIgnoreCase))
                return;

            var user = await _userManager.FindByIdAsync(userId);
            if (user?.CompanyId is not { } companyId)
                return;

            var utc = DateTime.UtcNow;

            // Trade references — replace set
            var existingRefs = await _context.TradeReferences.Where(t => t.CompanyId == companyId).ToListAsync(cancellationToken);
            _context.TradeReferences.RemoveRange(existingRefs);
            foreach (var dto in command.TradeReferences ?? new List<TradeReferenceDto>())
            {
                _context.TradeReferences.Add(new TradeReference
                {
                    Id = Guid.NewGuid(),
                    CompanyId = companyId,
                    TradeReferenceName = dto.TradeReferenceName,
                    TradeReferenceAddress = dto.TradeReferenceAddress,
                    TradeReferenceNumber = dto.TradeReferenceNumber,
                    ContactName = dto.ContactName,
                    ContactEmail = dto.ContactEmail,
                    ContactPhone = dto.ContactPhone,
                    CreatedAt = utc,
                    UpdatedAt = utc,
                });
            }

            // Regulatory compliance — upsert 1:1
            var rcDto = command.RegulatoryCompliance;
            if (rcDto != null)
            {
                var rc = await _context.RegulatoryCompliances.FirstOrDefaultAsync(r => r.CompanyId == companyId, cancellationToken);
                if (rc == null)
                {
                    rc = new RegulatoryCompliance { Id = Guid.NewGuid(), CompanyId = companyId, CreatedAt = utc };
                    _context.RegulatoryCompliances.Add(rc);
                }

                rc.BusinessDescriptionJson = rcDto.BusinessDescriptions.Count > 0
                    ? JsonSerializer.Serialize(rcDto.BusinessDescriptions, JsonOpts)
                    : null;
                rc.BusinessDescriptionOtherText = rcDto.BusinessDescriptionOtherText;
                rc.IntermediateProviderRegistryCompanyName = rcDto.IntermediateProviderRegistryCompanyName;
                rc.StirShakenCertCompanyName = rcDto.StirShakenCertCompanyName;
                rc.OcnStirShakenHeader = rcDto.OcnStirShakenHeader;
                rc.Fcc499FilerId = rcDto.Fcc499FilerId;
                rc.RobocallMitigationRegistered = rcDto.RobocallMitigationRegistered ?? false;
                rc.RobocallMitigationListedCompanyName = rcDto.RobocallMitigationListedCompanyName;
                rc.RobocallMitigationDatabaseNumber = rcDto.RobocallMitigationDatabaseNumber;
                rc.StirShakenRmdImplemented = rcDto.StirShakenRmdImplemented ?? false;
                rc.SigningAllCalls = rcDto.SigningAllCalls ?? false;
                rc.ComplianceUsBankAccount = rcDto.ComplianceUsBankAccount ?? false;
                rc.OriginateConversationalTraffic = rcDto.OriginateConversationalTraffic ?? false;
                rc.OriginateAutodialedTraffic = rcDto.OriginateAutodialedTraffic ?? false;
                rc.DirectAutodialClients = rcDto.DirectAutodialClients ?? false;
                rc.NonUsAutodialSources = rcDto.NonUsAutodialSources ?? false;
                rc.ItgTracingEngaged = rcDto.ItgTracingEngaged ?? false;
                rc.MoreThanThreeTracebacksLastYear = rcDto.MoreThanThreeTracebacksLastYear ?? false;
                rc.MoreThanFourGovImpersonationTracebacks = rcDto.MoreThanFourGovImpersonationTracebacks ?? false;
                rc.NonCooperativeVspByUsTelecom = rcDto.NonCooperativeVspByUsTelecom ?? false;
                rc.BlockedFromNetworkLastTwoYears = rcDto.BlockedFromNetworkLastTwoYears ?? false;
                rc.AdverseJudgementUnlawfulRobocalls = rcDto.AdverseJudgementUnlawfulRobocalls ?? false;
                rc.EstimatedAsrPercent = rcDto.EstimatedAsrPercent ?? 0;
                rc.EstimatedAloc = rcDto.EstimatedAloc ?? 0;
                rc.EstimatedUnallocated404Percent = rcDto.EstimatedUnallocated404Percent ?? 0;
                rc.EstimatedCancel487Percent = rcDto.EstimatedCancel487Percent ?? 0;
                rc.EstimatedShortDurationPercent = rcDto.EstimatedShortDurationPercent ?? 0;
                rc.UpdatedAt = utc;
            }

            // Product orders — replace from KYC product selections
            var existingOrders = await _context.ProductOrders.Where(p => p.CompanyId == companyId).ToListAsync(cancellationToken);
            _context.ProductOrders.RemoveRange(existingOrders);
            foreach (var sel in command.ProductSelections ?? new List<ProductSelectionDto>())
            {
                _context.ProductOrders.Add(new ProductOrder
                {
                    Id = Guid.NewGuid(),
                    CompanyId = companyId,
                    ProductType = sel.ProductType,
                    SubfieldsJson = BuildProductSubfieldsJson(sel),
                    CreatedAt = utc,
                    UpdatedAt = utc,
                });
            }

            // Technical info profile — upsert 1:1
            var tech = command.TechnicalInformation;
            if (tech != null)
            {
                var ti = await _context.CompanyTechnicalInfos.FirstOrDefaultAsync(t => t.CompanyId == companyId, cancellationToken);
                if (ti == null)
                {
                    ti = new CompanyTechnicalInfo { Id = Guid.NewGuid(), CompanyId = companyId, CreatedAt = utc };
                    _context.CompanyTechnicalInfos.Add(ti);
                }

                ti.DiallerServerLink = string.IsNullOrWhiteSpace(tech.DiallerServerLink) ? null : tech.DiallerServerLink.Trim();
                ti.ValidationLink = tech.ValidationLink?.Trim() ?? string.Empty;
                ti.ServerIPs = tech.ServerIPs?.Trim() ?? string.Empty;
                ti.DiallerLevel9Access = tech.DiallerLevel9AccessDetails?.Trim() ?? string.Empty;
                ti.UpdatedAt = utc;
            }

            // Attestation — upsert 1:1
            var att = command.Attestation;
            if (att != null)
            {
                var row = await _context.CompanyAttestations.FirstOrDefaultAsync(a => a.CompanyId == companyId, cancellationToken);
                if (row == null)
                {
                    row = new CompanyAttestation { Id = Guid.NewGuid(), CompanyId = companyId, CreatedAt = utc };
                    _context.CompanyAttestations.Add(row);
                }

                row.OfficerName = att.OfficerName;
                row.SignatureText = att.SignatureText;
                row.UpdatedAt = utc;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }

        private static string BuildProductSubfieldsJson(ProductSelectionDto p)
        {
            var o = new
            {
                p.NumberOfPorts,
                p.NumberOfAgents,
                p.NumberOfDIDs,
                p.SpecificAreaCodes,
                p.TfnQuantity,
                p.NumberOfBots,
                p.BotServerInformation,
                p.CloserDiallerDetails,
            };
            return JsonSerializer.Serialize(o, JsonOpts);
        }
    }
}
