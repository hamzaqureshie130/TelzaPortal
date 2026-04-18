namespace TelzaProject.Domain.Entities
{
    public class TradeReference
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        public string TradeReferenceName { get; set; } = string.Empty;
        public string TradeReferenceAddress { get; set; } = string.Empty;
        public string? TradeReferenceNumber { get; set; }
        public string ContactName { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
