using TelzaProject.Domain.Entities;

namespace TelzaProject.Application.Contracts
{
    public interface IClientRepository : IGenericRepository<Client>
    {
        Task<IReadOnlyList<Client>> GetClientsWithInvoicesAsync();
    }
}
