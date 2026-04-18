using TelzaProject.Domain.Enums;

namespace TelzaProject.Domain.Entities
{
    public class ProductOrder
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        public ProductType ProductType { get; set; }
        public string SubfieldsJson { get; set; } = "{}";

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
