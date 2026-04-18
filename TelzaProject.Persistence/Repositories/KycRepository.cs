using Microsoft.EntityFrameworkCore;
using TelzaProject.Application.Contracts;
using TelzaProject.Domain.Entities;
using TelzaProject.Domain.Enums;

namespace TelzaProject.Persistence.Repositories
{
    public class KycRepository : GenericRepository<KycApplication>, IKycRepository
    {
        public KycRepository(TelzaPortalDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IReadOnlyList<KycApplication>> GetAllKycsWithDetailsAsync()
        {
            return await _context.KycApplications
                .Include(k => k.CompanyDetails)
                .Include(k => k.TechnicalInformation)
                .Include(k => k.ProductSelections)
                .OrderByDescending(k => k.CreatedAt)
                .ToListAsync();
        }

        public async Task<KycApplication?> GetKycByUserIdAsync(string userId)
        {
            return await _context.KycApplications
                .Include(k => k.CompanyDetails)
                .Include(k => k.TechnicalInformation)
                .Include(k => k.ProductSelections)
                .FirstOrDefaultAsync(k => k.UserId == userId);
        }

        public async Task<KycApplication?> GetKycWithAllDetailsAsync(Guid id)
        {
            return await _context.KycApplications
                .Include(k => k.CompanyDetails)
                .Include(k => k.TechnicalInformation)
                .Include(k => k.ProductSelections)
                .FirstOrDefaultAsync(k => k.Id == id);
        }

        public async Task<bool> UpdateStatusAsync(Guid id, KycStatus status, CancellationToken cancellationToken = default)
        {
            var n = await _context.KycApplications
                .Where(k => k.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(k => k.Status, status)
                    .SetProperty(k => k.UpdatedAt, DateTime.UtcNow),
                    cancellationToken);
            return n > 0;
        }
    }
}
