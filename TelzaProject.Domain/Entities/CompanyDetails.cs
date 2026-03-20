using TelzaProject.Domain.Common;
using TelzaProject.Domain.Enums;

namespace TelzaProject.Domain.Entities
{
    public class CompanyDetails : BaseEntity
    {
        public Guid KycApplicationId { get; set; }

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

        public KycApplication KycApplication { get; set; } = null!;
    }
}
