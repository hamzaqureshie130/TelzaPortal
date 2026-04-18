using TelzaProject.Domain.Common;
using TelzaProject.Domain.Enums;

namespace TelzaProject.Domain.Entities
{
    /// <summary>Canonical company profile linked from AspNetUsers.CompanyId.</summary>
    public class Company : BaseEntity
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

        public BankingInfo? BankingInfo { get; set; }

        public ICollection<TradeReference> TradeReferences { get; set; } = new List<TradeReference>();
        public RegulatoryCompliance? RegulatoryCompliance { get; set; }
        public ICollection<ProductOrder> ProductOrders { get; set; } = new List<ProductOrder>();
        public CompanyTechnicalInfo? TechnicalInfoProfile { get; set; }
        public CompanyAttestation? Attestation { get; set; }
    }
}
