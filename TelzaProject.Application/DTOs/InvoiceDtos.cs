namespace TelzaProject.Application.DTOs
{
    public class InvoiceDto
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public Guid ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<InvoiceItemDto> Items { get; set; } = new();
    }

    public class CreateInvoiceDto
    {
        public Guid ClientId { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal Tax { get; set; }
        public string Status { get; set; } = "Draft";
        public List<CreateInvoiceItemDto> Items { get; set; } = new();
    }

    public class UpdateInvoiceDto
    {
        public Guid ClientId { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal Tax { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
