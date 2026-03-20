using Microsoft.EntityFrameworkCore;
using TelzaProject.Application.Contracts;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Persistence.Repositories
{
    public class InvoiceRepository : GenericRepository<Invoice>, IInvoiceRepository
    {
        public InvoiceRepository(TelzaPortalDbContext context) : base(context) { }

        public async Task<Invoice?> GetInvoiceWithDetailsAsync(Guid id) =>
            await _context.Invoices
                          .Include(i => i.Client)
                          .Include(i => i.InvoiceItems)
                          .FirstOrDefaultAsync(i => i.Id == id);

        public async Task<IReadOnlyList<Invoice>> GetInvoicesWithClientAsync() =>
            await _context.Invoices
                          .Include(i => i.Client)
                          .Include(i => i.InvoiceItems)
                          .ToListAsync();

        public async Task<string> GenerateInvoiceNumberAsync()
        {
            var count = await _context.Invoices.CountAsync();
            return $"INV-{DateTime.UtcNow:yyyyMM}-{(count + 1):D4}";
        }
    }
}
