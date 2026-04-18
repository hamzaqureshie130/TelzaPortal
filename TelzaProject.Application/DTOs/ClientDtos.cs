namespace TelzaProject.Application.DTOs
{
    public class ClientDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateClientDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
    }

    public class UpdateClientDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
    }

    /// <summary>Prefills create-invoice billing panel from company banking or latest KYC snapshot.</summary>
    public class ClientInvoiceBillingDto
    {
        public string PaymentMethod { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string BankAddress { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactFax { get; set; } = string.Empty;
    }
}
