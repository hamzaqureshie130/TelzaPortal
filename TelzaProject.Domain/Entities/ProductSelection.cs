using TelzaProject.Domain.Common;
using TelzaProject.Domain.Enums;

namespace TelzaProject.Domain.Entities
{
    /// <summary>
    /// Represents a product selection within a KYC application.
    /// Product-specific fields are nullable — only the relevant ones are populated
    /// based on the ProductType chosen.
    /// </summary>
    public class ProductSelection : BaseEntity
    {
        public Guid KycApplicationId { get; set; }
        public ProductType ProductType { get; set; }

        // ── VOIP ────────────────────────────────────────────────────────────
        public int? NumberOfPorts { get; set; }

        // ── Dialler Server ──────────────────────────────────────────────────
        public int? NumberOfAgents { get; set; }

        // ── Inbound DID ─────────────────────────────────────────────────────
        public int? NumberOfDIDs { get; set; }
        public string? SpecificAreaCodes { get; set; }

        // ── TFN ─────────────────────────────────────────────────────────────
        public int? TfnQuantity { get; set; }

        // ── AI Bots ─────────────────────────────────────────────────────────
        public int? NumberOfBots { get; set; }
        public string? BotServerInformation { get; set; }
        public string? CloserDiallerDetails { get; set; }

        public KycApplication KycApplication { get; set; } = null!;
    }
}
