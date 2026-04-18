namespace TelzaProject.Domain.Entities
{
    /// <summary>Company-level technical profile (<c>technical_info</c>).</summary>
    public class CompanyTechnicalInfo
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        public string? DiallerServerLink { get; set; }
        public string ValidationLink { get; set; } = string.Empty;
        public string ServerIPs { get; set; } = string.Empty;
        public string DiallerLevel9Access { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
