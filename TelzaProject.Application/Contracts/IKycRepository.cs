using TelzaProject.Domain.Entities;

namespace TelzaProject.Application.Contracts
{
    public interface IKycRepository : IGenericRepository<KycApplication>
    {
        Task<KycApplication?> GetKycWithAllDetailsAsync(Guid id);
        Task<IReadOnlyList<KycApplication>> GetAllKycsWithDetailsAsync();
        Task<KycApplication?> GetKycByUserIdAsync(string userId);
    }
}
