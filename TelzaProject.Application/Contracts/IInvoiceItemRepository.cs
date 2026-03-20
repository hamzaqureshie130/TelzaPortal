using TelzaProject.Domain.Entities;

namespace TelzaProject.Application.Contracts
{
    public interface IInvoiceItemRepository : IGenericRepository<InvoiceItem>
    {
        Task<IReadOnlyList<InvoiceItem>> GetItemsByInvoiceIdAsync(Guid invoiceId);
        Task AddRangeAsync(IEnumerable<InvoiceItem> items);
    }
}
