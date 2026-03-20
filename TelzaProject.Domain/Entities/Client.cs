using TelzaProject.Domain.Common;

namespace TelzaProject.Domain.Entities
{
    public class Client : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
}
