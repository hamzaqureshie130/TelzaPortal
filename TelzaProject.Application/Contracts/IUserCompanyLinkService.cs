using TelzaProject.Application.DTOs;

namespace TelzaProject.Application.Contracts
{
    public interface IUserCompanyLinkService
    {
        /// <summary>Creates or updates Companies row and sets AspNetUsers.CompanyId (skipped for guest-* user ids).</summary>
        Task UpsertCompanyForUserAsync(string userId, CompanyDetailsDto details, CompanyBankingInfoDto? companyBanking = null, CancellationToken cancellationToken = default);
    }
}
