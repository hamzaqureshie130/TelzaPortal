using TelzaProject.Domain.Enums;

namespace TelzaProject.Application.DTOs
{
    // ─── Company Details ────────────────────────────────────────────────────────
    public class CompanyDetailsDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? OtherDesignatedNames { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string? MailingAddress { get; set; }
        public string? MailingCityStateZip { get; set; }
        public bool BusinessBasedInUs { get; set; }
        public string? StateOfIncorporation { get; set; }
        public DateTime? DateOfIncorporation { get; set; }
        public string? BusinessLicenseNumber { get; set; }
        public string FeinNumber { get; set; } = string.Empty;
        public string FrnNumber { get; set; } = string.Empty;
        public CorporateType CorporateType { get; set; }
        public string BusinessLine { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string TeamsOrWhatsApp { get; set; } = string.Empty;
        public string FilerID499 { get; set; } = string.Empty;
        public string BusinessContactName { get; set; } = string.Empty;
        public string BusinessPhone { get; set; } = string.Empty;
        public string? MobilePhoneSeparate { get; set; }
        public string? EmailForRates { get; set; }
        public string? EmailForNotices { get; set; }
        public string? EmailForBalances { get; set; }
        public string VoipPortalEmail { get; set; } = string.Empty;
        public string? CustomerMainPhone { get; set; }
        public string? CustomerFax { get; set; }
        public string? CustomerUrl { get; set; }
        public string? CompanyContactName { get; set; }
        public string? PrimaryMainEmail { get; set; }
        public string? BillingAccountingEmail { get; set; }
        public string? SupportNocEmail { get; set; }
        public string? LegalEmail { get; set; }
        public string? ComplianceEmail { get; set; }
        public string? FraudReportEmail { get; set; }
        public string? SkypeId { get; set; }
    }

    // ─── Product Selection ──────────────────────────────────────────────────────
    public class ProductSelectionDto
    {
        public ProductType ProductType { get; set; }

        // VOIP
        public int? NumberOfPorts { get; set; }

        // Dialler Server
        public int? NumberOfAgents { get; set; }

        // Inbound DID
        public int? NumberOfDIDs { get; set; }
        public string? SpecificAreaCodes { get; set; }

        // TFN
        public int? TfnQuantity { get; set; }

        // AI Bots
        public int? NumberOfBots { get; set; }
        public string? BotServerInformation { get; set; }
        public string? CloserDiallerDetails { get; set; }
    }

    // ─── Technical Information ──────────────────────────────────────────────────
    public class TechnicalInformationDto
    {
        public string? DiallerServerLink { get; set; }
        public string? ValidationLink { get; set; }
        public string? ServerIPs { get; set; }
        /// <summary>SSH key, API token, or other developer-defined credential text.</summary>
        public string DiallerLevel9AccessDetails { get; set; } = string.Empty;
    }

    /// <summary>Banking, trade refs, regulatory, and attestation copied from submit payload (stored as JSON on the KYC row).</summary>
    public class KycOnboardingSnapshotDto
    {
        public CompanyBankingInfoDto? CompanyBanking { get; set; }
        public List<TradeReferenceDto> TradeReferences { get; set; } = new();
        public RegulatoryComplianceDto? RegulatoryCompliance { get; set; }
        public CompanyAttestationDto? Attestation { get; set; }
    }

    // ─── Full KYC Application ───────────────────────────────────────────────────
    public class KycApplicationDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public KycStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public CompanyDetailsDto? CompanyDetails { get; set; }
        public List<ProductSelectionDto> ProductSelections { get; set; } = new();
        public TechnicalInformationDto? TechnicalInformation { get; set; }
        /// <summary>Populated when loading a single application (deserialized from <c>OnboardingExtensionsJson</c>).</summary>
        public KycOnboardingSnapshotDto? OnboardingExtensions { get; set; }
    }

    // ─── Create KYC (submitted by customer) ────────────────────────────────────
    public class CreateKycApplicationDto
    {
        public string UserId { get; set; } = string.Empty;
        public CompanyDetailsDto CompanyDetails { get; set; } = new();
        public List<ProductSelectionDto> ProductSelections { get; set; } = new();
        public TechnicalInformationDto TechnicalInformation { get; set; } = new();
    }

    /// <summary>Admin: PATCH body for <c>api/kyc/{{id}}/status</c>.</summary>
    public class UpdateKycStatusRequest
    {
        public KycStatus Status { get; set; }
    }
}
