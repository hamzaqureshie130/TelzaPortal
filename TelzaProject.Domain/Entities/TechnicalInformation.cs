using TelzaProject.Domain.Common;

namespace TelzaProject.Domain.Entities
{
    public class TechnicalInformation : BaseEntity
    {
        public Guid KycApplicationId { get; set; }

        /// <summary>Only required if using a dialler from another company.</summary>
        public string? DiallerServerLink { get; set; }

        public string? ValidationLink { get; set; }
        public string? ServerIPs { get; set; }
        public bool DiallerLevel9Access { get; set; }

        public KycApplication KycApplication { get; set; } = null!;
    }
}
