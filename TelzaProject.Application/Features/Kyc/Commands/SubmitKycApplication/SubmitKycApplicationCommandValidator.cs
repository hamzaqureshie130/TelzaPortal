using System.Text.RegularExpressions;
using FluentValidation;
using TelzaProject.Domain.Enums;

namespace TelzaProject.Application.Features.Kyc.Commands.SubmitKycApplication
{
    public class SubmitKycApplicationCommandValidator : AbstractValidator<SubmitKycApplicationCommand>
    {
        private static readonly Regex E164Regex = new(@"^\+[1-9]\d{1,14}$", RegexOptions.Compiled);

        public SubmitKycApplicationCommandValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().WithMessage("UserId is required.");

            RuleFor(x => x.CompanyDetails).NotNull().WithMessage("Company details are required.");

            When(x => x.CompanyDetails != null, () =>
            {
                RuleFor(x => x.CompanyDetails!.CompanyName).NotEmpty().WithMessage("Legal company name is required.");
                RuleFor(x => x.CompanyDetails!.Address).NotEmpty().WithMessage("Physical address is required.");
                RuleFor(x => x.CompanyDetails!.City).NotEmpty().WithMessage("Physical city is required.");
                RuleFor(x => x.CompanyDetails!.State).NotEmpty().WithMessage("Physical state is required.");
                RuleFor(x => x.CompanyDetails!.ZipCode).NotEmpty().WithMessage("Physical ZIP is required.");
                RuleFor(x => x.CompanyDetails!.Country).NotEmpty().WithMessage("Country is required.");
                RuleFor(x => x.CompanyDetails!.CorporateType).IsInEnum().WithMessage("Corporate type is required.");
                RuleFor(x => x.CompanyDetails!.BusinessLine).NotEmpty().WithMessage("Business line is required.");
                RuleFor(x => x.CompanyDetails!.MobileNumber).NotEmpty().WithMessage("Mobile number is required.");
                RuleFor(x => x.CompanyDetails!.TeamsOrWhatsApp).NotEmpty().WithMessage("Teams ID or WhatsApp is required.");
                RuleFor(x => x.CompanyDetails!.FilerID499).NotEmpty().WithMessage("499 Filer ID is required.");
                RuleFor(x => x.CompanyDetails!.BusinessContactName).NotEmpty().WithMessage("Business contact name is required.");
                RuleFor(x => x.CompanyDetails!.BusinessPhone).NotEmpty().WithMessage("Business phone is required.");
                RuleFor(x => x.CompanyDetails!.FeinNumber).NotEmpty().WithMessage("FEIN is required.");
                RuleFor(x => x.CompanyDetails!.FrnNumber).NotEmpty().WithMessage("FRN is required.");

                RuleFor(x => x.CompanyDetails!.VoipPortalEmail)
                    .NotEmpty().WithMessage("VoIP Portal email is required.")
                    .EmailAddress().WithMessage("Invalid VoIP Portal email format.");

                RuleFor(x => x.CompanyDetails!.EmailForRates)
                    .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CompanyDetails!.EmailForRates))
                    .WithMessage("Invalid email for rates.");
                RuleFor(x => x.CompanyDetails!.EmailForNotices)
                    .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CompanyDetails!.EmailForNotices))
                    .WithMessage("Invalid email for notices.");
                RuleFor(x => x.CompanyDetails!.EmailForBalances)
                    .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CompanyDetails!.EmailForBalances))
                    .WithMessage("Invalid email for balances.");
                RuleFor(x => x.CompanyDetails!.PrimaryMainEmail)
                    .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CompanyDetails!.PrimaryMainEmail))
                    .WithMessage("Invalid primary main email.");
                RuleFor(x => x.CompanyDetails!.BillingAccountingEmail)
                    .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CompanyDetails!.BillingAccountingEmail))
                    .WithMessage("Invalid billing/accounting email.");
                RuleFor(x => x.CompanyDetails!.SupportNocEmail)
                    .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CompanyDetails!.SupportNocEmail))
                    .WithMessage("Invalid support/NOC email.");
                RuleFor(x => x.CompanyDetails!.LegalEmail)
                    .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CompanyDetails!.LegalEmail))
                    .WithMessage("Invalid legal email.");
                RuleFor(x => x.CompanyDetails!.ComplianceEmail)
                    .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CompanyDetails!.ComplianceEmail))
                    .WithMessage("Invalid compliance email.");
                RuleFor(x => x.CompanyDetails!.FraudReportEmail)
                    .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CompanyDetails!.FraudReportEmail))
                    .WithMessage("Invalid fraud report email.");

                When(x => x.CompanyDetails!.BusinessBasedInUs, () =>
                {
                    RuleFor(x => x.CompanyDetails!.StateOfIncorporation)
                        .NotEmpty().WithMessage("State of incorporation is required when the business is U.S.-based.");
                });
            });

            RuleFor(x => x.CompanyBanking).NotNull().WithMessage("Banking information is required.");

            When(x => x.CompanyBanking != null && x.CompanyBanking.HasUsBankAccount, () =>
            {
                RuleFor(x => x.CompanyBanking!.BankName).NotEmpty().WithMessage("Bank name is required.");
                RuleFor(x => x.CompanyBanking!.BankAddress).NotEmpty().WithMessage("Bank address is required.");
                RuleFor(x => x.CompanyBanking!.ContactName).NotEmpty().WithMessage("Bank contact name is required.");
                RuleFor(x => x.CompanyBanking!.ContactPhone).NotEmpty().WithMessage("Bank contact phone is required.");
                RuleFor(x => x.CompanyBanking!.ContactEmail)
                    .NotEmpty().WithMessage("Bank contact email is required.")
                    .EmailAddress().WithMessage("Invalid bank contact email.");
                RuleFor(x => x.CompanyBanking!.AccountNumber).NotEmpty().WithMessage("Account number is required.");
            });

            RuleFor(x => x.ProductSelections).NotEmpty().WithMessage("Please select at least one product.");

            RuleForEach(x => x.ProductSelections).ChildRules(p =>
            {
                p.RuleFor(s => s.ProductType).IsInEnum().WithMessage("Invalid product type.");
                p.When(s => s.ProductType == ProductType.VOIP, () =>
                {
                    p.RuleFor(s => s.NumberOfPorts).NotNull().GreaterThan(0).WithMessage("Number of ports is required for VoIP.");
                });
                p.When(s => s.ProductType == ProductType.DiallerServer, () =>
                {
                    p.RuleFor(s => s.NumberOfAgents).NotNull().GreaterThan(0).WithMessage("Number of agents is required for Dialler Server.");
                });
                p.When(s => s.ProductType == ProductType.InboundDID, () =>
                {
                    p.RuleFor(s => s.NumberOfDIDs).NotNull().GreaterThan(0).WithMessage("Number of DIDs is required for Inbound DID.");
                });
                p.When(s => s.ProductType == ProductType.TFN, () =>
                {
                    p.RuleFor(s => s.TfnQuantity).NotNull().GreaterThan(0).WithMessage("Quantity is required for toll-free.");
                });
                p.When(s => s.ProductType == ProductType.AIBots, () =>
                {
                    p.RuleFor(s => s.NumberOfBots).NotNull().GreaterThan(0).WithMessage("Number of bots is required for AI Bots.");
                    p.RuleFor(s => s.BotServerInformation).NotEmpty().WithMessage("Server information is required for AI Bots.");
                    p.RuleFor(s => s.CloserDiallerDetails).NotEmpty().WithMessage("Closer dialler details are required for AI Bots.");
                });
            });

            RuleFor(x => x.TechnicalInformation).NotNull().WithMessage("Technical information is required.");
            When(x => x.TechnicalInformation != null, () =>
            {
                RuleFor(x => x.TechnicalInformation!.ValidationLink)
                    .NotEmpty().WithMessage("Validation link is required.")
                    .Must(BeHttpOrHttpsUrl).WithMessage("Validation link must be a valid http(s) URL.");
                RuleFor(x => x.TechnicalInformation!.ServerIPs)
                    .NotEmpty().WithMessage("Server IPs are required (one per line).");
                RuleFor(x => x.TechnicalInformation!.DiallerLevel9AccessDetails)
                    .NotEmpty().WithMessage("Dialler level 9 / access credentials are required.");
                RuleFor(x => x.TechnicalInformation!.DiallerServerLink)
                    .Must(BeOptionalHttpUrl)
                    .When(x => !string.IsNullOrWhiteSpace(x.TechnicalInformation!.DiallerServerLink))
                    .WithMessage("Dialler server link must be a valid http(s) URL when provided.");
            });

            RuleFor(x => x.TradeReferences).NotNull().WithMessage("Trade references are required.");
            RuleFor(x => x.TradeReferences).NotEmpty().WithMessage("Add at least one trade reference.");
            RuleForEach(x => x.TradeReferences).ChildRules(tr =>
            {
                tr.RuleFor(t => t.TradeReferenceName).NotEmpty();
                tr.RuleFor(t => t.TradeReferenceAddress).NotEmpty();
                tr.RuleFor(t => t.ContactName).NotEmpty();
                tr.RuleFor(t => t.ContactEmail).NotEmpty().EmailAddress();
                tr.RuleFor(t => t.ContactPhone).NotEmpty().Must(BeE164).WithMessage("Contact phone should be in E.164 format (e.g. +15551234567).");
            });

            RuleFor(x => x.RegulatoryCompliance).NotNull().WithMessage("Regulatory & compliance section is required.");
            When(x => x.RegulatoryCompliance != null, () =>
            {
                RuleFor(x => x.RegulatoryCompliance!.IntermediateProviderRegistryCompanyName).NotEmpty();
                RuleFor(x => x.RegulatoryCompliance!.StirShakenCertCompanyName).NotEmpty();
                RuleFor(x => x.RegulatoryCompliance!.OcnStirShakenHeader).NotEmpty();
                RuleFor(x => x.RegulatoryCompliance!.Fcc499FilerId).NotEmpty();

                RuleFor(x => x.RegulatoryCompliance!.RobocallMitigationRegistered).NotNull().WithMessage("RoboCall Mitigation Database registration is required.");
                RuleFor(x => x.RegulatoryCompliance!.StirShakenRmdImplemented).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.SigningAllCalls).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.ComplianceUsBankAccount).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.OriginateConversationalTraffic).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.OriginateAutodialedTraffic).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.DirectAutodialClients).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.NonUsAutodialSources).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.ItgTracingEngaged).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.MoreThanThreeTracebacksLastYear).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.MoreThanFourGovImpersonationTracebacks).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.NonCooperativeVspByUsTelecom).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.BlockedFromNetworkLastTwoYears).NotNull();
                RuleFor(x => x.RegulatoryCompliance!.AdverseJudgementUnlawfulRobocalls).NotNull();

                RuleFor(x => x.RegulatoryCompliance!.EstimatedAsrPercent).NotNull().InclusiveBetween(0, 100);
                RuleFor(x => x.RegulatoryCompliance!.EstimatedAloc).NotNull().GreaterThanOrEqualTo(0);
                RuleFor(x => x.RegulatoryCompliance!.EstimatedUnallocated404Percent).NotNull().InclusiveBetween(0, 100);
                RuleFor(x => x.RegulatoryCompliance!.EstimatedCancel487Percent).NotNull().InclusiveBetween(0, 100);
                RuleFor(x => x.RegulatoryCompliance!.EstimatedShortDurationPercent).NotNull().InclusiveBetween(0, 100);

                When(x => x.RegulatoryCompliance!.BusinessDescriptions.Any(d => string.Equals(d, "other", StringComparison.OrdinalIgnoreCase)), () =>
                {
                    RuleFor(x => x.RegulatoryCompliance!.BusinessDescriptionOtherText)
                        .NotEmpty().WithMessage("Describe your business when \"Other\" is selected.");
                });

                When(x => x.RegulatoryCompliance!.RobocallMitigationRegistered == true, () =>
                {
                    RuleFor(x => x.RegulatoryCompliance!.RobocallMitigationListedCompanyName).NotEmpty();
                    RuleFor(x => x.RegulatoryCompliance!.RobocallMitigationDatabaseNumber).NotEmpty();
                });
            });

            RuleFor(x => x.Attestation).NotNull();
            When(x => x.Attestation != null, () =>
            {
                RuleFor(x => x.Attestation!.OfficerName).NotEmpty().WithMessage("Officer name is required.");
                RuleFor(x => x.Attestation!.SignatureText).NotEmpty().WithMessage("Typed signature is required.");
            });
        }

        private static bool BeE164(string? phone) =>
            !string.IsNullOrWhiteSpace(phone) && E164Regex.IsMatch(phone.Trim());

        private static bool BeHttpOrHttpsUrl(string? url) =>
            !string.IsNullOrWhiteSpace(url) && Uri.TryCreate(url.Trim(), UriKind.Absolute, out var u)
            && (u.Scheme == Uri.UriSchemeHttp || u.Scheme == Uri.UriSchemeHttps);

        private static bool BeOptionalHttpUrl(string? url) =>
            string.IsNullOrWhiteSpace(url) || BeHttpOrHttpsUrl(url);
    }
}
