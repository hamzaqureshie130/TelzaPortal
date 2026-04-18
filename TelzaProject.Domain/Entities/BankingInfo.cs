using TelzaProject.Domain.Common;

namespace TelzaProject.Domain.Entities
{
    /// <summary>U.S. bank account details; one row per company (<c>banking_info</c>).</summary>
    public class BankingInfo : BaseEntity
    {
        public Guid CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        public bool HasUsBankAccount { get; set; }
        public string? BankName { get; set; }
        public string? BankAddress { get; set; }
        public string? ContactName { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactFax { get; set; }
        public string? AccountNumber { get; set; }
    }
}
