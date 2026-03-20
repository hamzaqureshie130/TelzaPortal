using TelzaProject.Domain.Common;
using TelzaProject.Domain.Enums;

namespace TelzaProject.Domain.Entities
{
    public class KycApplication : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public KycStatus Status { get; set; } = KycStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public CompanyDetails? CompanyDetails { get; set; }
        public BillingInformation? BillingInformation { get; set; }
        public TechnicalInformation? TechnicalInformation { get; set; }
        public ICollection<ProductSelection> ProductSelections { get; set; } = new List<ProductSelection>();
    }
}
