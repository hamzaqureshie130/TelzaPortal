using TelzaProject.Domain.Entities;
using TelzaProject.Domain.Enums;

namespace TelzaProject.Application.Contracts
{
    public interface IKycRepository : IGenericRepository<KycApplication>
    {
        Task<KycApplication?> GetKycWithAllDetailsAsync(Guid id);
        Task<IReadOnlyList<KycApplication>> GetAllKycsWithDetailsAsync();
        Task<KycApplication?> GetKycByUserIdAsync(string userId);
        Task<bool> UpdateStatusAsync(Guid id, KycStatus status, CancellationToken cancellationToken = default);
    }
}
