using TelzaProject.Domain.Entities;

namespace TelzaProject.Application.Contracts
{
    public interface IInvoiceRepository : IGenericRepository<Invoice>
    {
        Task<Invoice?> GetInvoiceWithDetailsAsync(Guid id);
        Task<IReadOnlyList<Invoice>> GetInvoicesWithClientAsync();
        Task<string> GenerateInvoiceNumberAsync();
    }
}
