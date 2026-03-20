using TelzaProject.Domain.Common;

namespace TelzaProject.Domain.Entities
{
    public class BillingInformation : BaseEntity
    {
        public Guid KycApplicationId { get; set; }

        public string BillingContactName { get; set; } = string.Empty;
        public string BillingEmail { get; set; } = string.Empty;
        public string BillingAddress { get; set; } = string.Empty;
        public string BillingCity { get; set; } = string.Empty;
        public string BillingState { get; set; } = string.Empty;
        public string BillingCountry { get; set; } = string.Empty;
        public string BillingZipCode { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string RoutingNumber { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;

        public KycApplication KycApplication { get; set; } = null!;
    }
}
