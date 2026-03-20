using Microsoft.EntityFrameworkCore;
using TelzaProject.Application.Contracts;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Persistence.Repositories
{
    public class ClientRepository : GenericRepository<Client>, IClientRepository
    {
        public ClientRepository(TelzaPortalDbContext context) : base(context) { }

        public async Task<IReadOnlyList<Client>> GetClientsWithInvoicesAsync() =>
            await _context.Clients
                          .Include(c => c.Invoices)
                          .ToListAsync();
    }
}
