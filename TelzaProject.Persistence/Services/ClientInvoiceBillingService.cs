using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Exceptions;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Persistence.Services
{
    public class ClientInvoiceBillingService : IClientInvoiceBillingService
    {
        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            NumberHandling = JsonNumberHandling.AllowReadingFromString,
        };

        private readonly TelzaPortalDbContext _context;

        public ClientInvoiceBillingService(TelzaPortalDbContext context)
        {
            _context = context;
        }

        public async Task<ClientInvoiceBillingDto> GetForKycAsync(Guid kycApplicationId, CancellationToken cancellationToken = default)
        {
            var kyc = await _context.KycApplications.AsNoTracking()
                .FirstOrDefaultAsync(k => k.Id == kycApplicationId, cancellationToken)
                ?? throw new NotFoundException(nameof(KycApplication), kycApplicationId);

            return MapFromOnboardingJson(kyc.OnboardingExtensionsJson);
        }

        public async Task<ClientInvoiceBillingDto> GetForClientAsync(Guid clientId, CancellationToken cancellationToken = default)
        {
            var client = await _context.Clients.AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == clientId, cancellationToken)
                ?? throw new NotFoundException(nameof(Client), clientId);

            var empty = new ClientInvoiceBillingDto();
            var email = (client.Email ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(email))
                return empty;

            var emailUpper = email.ToUpperInvariant();

            // 1) AspNetUsers → Company → BankingInfo
            var user = await _context.Users.AsNoTracking()
                .FirstOrDefaultAsync(u =>
                        u.NormalizedEmail == emailUpper
                        || (u.Email != null && u.Email.Trim().ToUpperInvariant() == emailUpper),
                    cancellationToken);

            if (user?.CompanyId is Guid userCompanyId)
            {
                var bi = await _context.BankingInfos.AsNoTracking()
                    .FirstOrDefaultAsync(b => b.CompanyId == userCompanyId, cancellationToken);
                var fromBank = MapBanking(bi);
                if (fromBank != null)
                    return fromBank;
            }

            // 2) Company profile by VoIP portal email (typical KYC match)
            var company = await _context.Companies
                .AsNoTracking()
                .Include(c => c.BankingInfo)
                .FirstOrDefaultAsync(c =>
                        c.VoipPortalEmail != null
                        && c.VoipPortalEmail.Trim().ToUpperInvariant() == emailUpper,
                    cancellationToken);

            if (company?.BankingInfo != null)
            {
                var fromCompany = MapBanking(company.BankingInfo);
                if (fromCompany != null)
                    return fromCompany;
            }

            // 3) Latest KYC where client email matches company contact emails (not only VoipPortalEmail)
            var kyc = await _context.KycApplications
                .AsNoTracking()
                .Include(k => k.CompanyDetails)
                .Where(k => k.CompanyDetails != null && ClientEmailMatchesCompanyDetails(emailUpper, k.CompanyDetails!))
                .OrderByDescending(k => k.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (kyc != null)
            {
                var fromKyc = MapFromOnboardingJson(kyc.OnboardingExtensionsJson);
                if (!IsEmptyBilling(fromKyc))
                    return fromKyc;
            }

            return empty;
        }

        private static bool ClientEmailMatchesCompanyDetails(string normalizedClientEmail, CompanyDetails cd)
        {
            static string? Norm(string? s) =>
                string.IsNullOrWhiteSpace(s) ? null : s.Trim().ToUpperInvariant();

            foreach (var t in new[] { Norm(cd.VoipPortalEmail), Norm(cd.PrimaryMainEmail), Norm(cd.BillingAccountingEmail) })
            {
                if (t != null && t == normalizedClientEmail)
                    return true;
            }

            return false;
        }

        private static ClientInvoiceBillingDto MapFromOnboardingJson(string? json)
        {
            var empty = new ClientInvoiceBillingDto();
            if (string.IsNullOrWhiteSpace(json))
                return empty;

            try
            {
                var snap = JsonSerializer.Deserialize<KycOnboardingSnapshotDto>(json, JsonOpts);
                return MapFromCompanyBanking(snap?.CompanyBanking) ?? empty;
            }
            catch (JsonException)
            {
                return empty;
            }
        }

        private static bool IsEmptyBilling(ClientInvoiceBillingDto b) =>
            string.IsNullOrWhiteSpace(b.BankName)
            && string.IsNullOrWhiteSpace(b.AccountNumber)
            && string.IsNullOrWhiteSpace(b.AccountName);

        private static ClientInvoiceBillingDto? MapFromCompanyBanking(CompanyBankingInfoDto? cb)
        {
            if (cb == null || !cb.HasUsBankAccount)
                return null;

            return new ClientInvoiceBillingDto
            {
                PaymentMethod = "Bank Transfer",
                BankName = cb.BankName ?? string.Empty,
                BankAddress = cb.BankAddress ?? string.Empty,
                AccountName = cb.ContactName ?? string.Empty,
                AccountNumber = cb.AccountNumber ?? string.Empty,
                ContactPhone = cb.ContactPhone ?? string.Empty,
                ContactEmail = cb.ContactEmail ?? string.Empty,
                ContactFax = cb.ContactFax ?? string.Empty,
            };
        }

        private static ClientInvoiceBillingDto? MapBanking(BankingInfo? bi)
        {
            if (bi == null || !bi.HasUsBankAccount)
                return null;

            return new ClientInvoiceBillingDto
            {
                PaymentMethod = "Bank Transfer",
                BankName = bi.BankName ?? string.Empty,
                BankAddress = bi.BankAddress ?? string.Empty,
                AccountName = bi.ContactName ?? string.Empty,
                AccountNumber = bi.AccountNumber ?? string.Empty,
                ContactPhone = bi.ContactPhone ?? string.Empty,
                ContactEmail = bi.ContactEmail ?? string.Empty,
                ContactFax = bi.ContactFax ?? string.Empty,
            };
        }
    }
}
