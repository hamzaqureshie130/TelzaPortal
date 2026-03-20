namespace TelzaProject.Application.DTOs
{
    public class InvoiceItemDto
    {
        public Guid Id { get; set; }
        public Guid InvoiceId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Total { get; set; }
    }

    public class CreateInvoiceItemDto
    {
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
