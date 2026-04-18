namespace TelzaProject.Domain.Entities
{
    public class CompanyAttestation
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        public string OfficerName { get; set; } = string.Empty;
        public string SignatureText { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
