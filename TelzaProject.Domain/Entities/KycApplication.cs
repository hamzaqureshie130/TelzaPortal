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

        /// <summary>JSON snapshot of banking, trade references, regulatory, and attestation as submitted (for admin review).</summary>
        public string? OnboardingExtensionsJson { get; set; }

        // Navigation properties
        public CompanyDetails? CompanyDetails { get; set; }
        public TechnicalInformation? TechnicalInformation { get; set; }
        public ICollection<ProductSelection> ProductSelections { get; set; } = new List<ProductSelection>();
    }
}
