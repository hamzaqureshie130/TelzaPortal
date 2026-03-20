using TelzaProject.Domain.Enums;

namespace TelzaProject.Application.DTOs
{
    // ─── Company Details ────────────────────────────────────────────────────────
    public class CompanyDetailsDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public CorporateType CorporateType { get; set; }
        public string BusinessLine { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string TeamsOrWhatsApp { get; set; } = string.Empty;
        public string FilerID499 { get; set; } = string.Empty;
        public string BusinessContactName { get; set; } = string.Empty;
        public string VoipPortalEmail { get; set; } = string.Empty;
    }

    // ─── Billing Information ────────────────────────────────────────────────────
    public class BillingInformationDto
    {
        public string BillingContactName { get; set; } = string.Empty;
        public string BillingEmail { get; set; } = string.Empty;
        public string BillingAddress { get; set; } = string.Empty;
        public string BillingCity { get; set; } = string.Empty;
        public string BillingState { get; set; } = string.Empty;
        public string BillingCountry { get; set; } = string.Empty;
        public string BillingZipCode { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string RoutingNumber { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
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
        public bool DiallerLevel9Access { get; set; }
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
        public BillingInformationDto? BillingInformation { get; set; }
        public List<ProductSelectionDto> ProductSelections { get; set; } = new();
        public TechnicalInformationDto? TechnicalInformation { get; set; }
    }

    // ─── Create KYC (submitted by customer) ────────────────────────────────────
    public class CreateKycApplicationDto
    {
        public string UserId { get; set; } = string.Empty;
        public CompanyDetailsDto CompanyDetails { get; set; } = new();
        public BillingInformationDto BillingInformation { get; set; } = new();
        public List<ProductSelectionDto> ProductSelections { get; set; } = new();
        public TechnicalInformationDto TechnicalInformation { get; set; } = new();
    }
}
