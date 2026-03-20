using Microsoft.EntityFrameworkCore;
using TelzaProject.Application.Contracts;
using TelzaProject.Domain.Entities;

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
                .Include(k => k.BillingInformation)
                .Include(k => k.TechnicalInformation)
                .Include(k => k.ProductSelections)
                .OrderByDescending(k => k.CreatedAt)
                .ToListAsync();
        }

        public async Task<KycApplication?> GetKycByUserIdAsync(string userId)
        {
            return await _context.KycApplications
                .Include(k => k.CompanyDetails)
                .Include(k => k.BillingInformation)
                .Include(k => k.TechnicalInformation)
                .Include(k => k.ProductSelections)
                .FirstOrDefaultAsync(k => k.UserId == userId);
        }

        public async Task<KycApplication?> GetKycWithAllDetailsAsync(Guid id)
        {
            return await _context.KycApplications
                .Include(k => k.CompanyDetails)
                .Include(k => k.BillingInformation)
                .Include(k => k.TechnicalInformation)
                .Include(k => k.ProductSelections)
                .FirstOrDefaultAsync(k => k.Id == id);
        }
    }
}
