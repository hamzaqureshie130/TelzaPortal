using Microsoft.EntityFrameworkCore;
using TelzaProject.Application.Contracts;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Persistence.Repositories
{
    public class InvoiceItemRepository : GenericRepository<InvoiceItem>, IInvoiceItemRepository
    {
        public InvoiceItemRepository(TelzaPortalDbContext context) : base(context) { }

        public async Task<IReadOnlyList<InvoiceItem>> GetItemsByInvoiceIdAsync(Guid invoiceId) =>
            await _context.InvoiceItems
                          .Where(i => i.InvoiceId == invoiceId)
                          .ToListAsync();

        public async Task AddRangeAsync(IEnumerable<InvoiceItem> items)
        {
            await _context.InvoiceItems.AddRangeAsync(items);
            await _context.SaveChangesAsync();
        }
    }
}
