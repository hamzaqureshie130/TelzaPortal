using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Domain.Entities;
using TelzaProject.Persistence.Identity;

namespace TelzaProject.Persistence.Services
{
    public class UserCompanyLinkService : IUserCompanyLinkService
    {
        private readonly TelzaPortalDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public UserCompanyLinkService(
            TelzaPortalDbContext context,
            UserManager<ApplicationUser> userManager,
            IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task UpsertCompanyForUserAsync(
            string userId,
            CompanyDetailsDto details,
            CompanyBankingInfoDto? companyBanking = null,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(userId) || userId.StartsWith("guest-", StringComparison.OrdinalIgnoreCase))
                return;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return;

            Company? company = null;
            if (user.CompanyId.HasValue)
                company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == user.CompanyId.Value, cancellationToken);

            if (company == null)
            {
                company = _mapper.Map<Company>(details);
                company.Id = Guid.NewGuid();
                _context.Companies.Add(company);
                user.CompanyId = company.Id;
                await _userManager.UpdateAsync(user);
            }
            else
                _mapper.Map(details, company);

            await _context.SaveChangesAsync(cancellationToken);

            if (companyBanking == null || !user.CompanyId.HasValue)
                return;

            var companyId = user.CompanyId.Value;
            var bi = await _context.BankingInfos.FirstOrDefaultAsync(b => b.CompanyId == companyId, cancellationToken);
            if (bi == null)
            {
                bi = new BankingInfo { Id = Guid.NewGuid(), CompanyId = companyId };
                _context.BankingInfos.Add(bi);
            }

            bi.HasUsBankAccount = companyBanking.HasUsBankAccount;
            if (companyBanking.HasUsBankAccount)
            {
                bi.BankName = companyBanking.BankName;
                bi.BankAddress = companyBanking.BankAddress;
                bi.ContactName = companyBanking.ContactName;
                bi.ContactPhone = companyBanking.ContactPhone;
                bi.ContactEmail = companyBanking.ContactEmail;
                bi.ContactFax = companyBanking.ContactFax;
                bi.AccountNumber = companyBanking.AccountNumber;
            }
            else
            {
                bi.BankName = null;
                bi.BankAddress = null;
                bi.ContactName = null;
                bi.ContactPhone = null;
                bi.ContactEmail = null;
                bi.ContactFax = null;
                bi.AccountNumber = null;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
