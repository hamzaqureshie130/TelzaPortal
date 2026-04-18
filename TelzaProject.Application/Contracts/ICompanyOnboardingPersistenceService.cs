using TelzaProject.Application.Features.Kyc.Commands.SubmitKycApplication;

namespace TelzaProject.Application.Contracts
{
    public interface ICompanyOnboardingPersistenceService
    {
        /// <summary>Persists trade references, regulatory compliance, product orders, technical_info, and attestation for the user's company. No-op for guest users or users without a company.</summary>
        Task SaveAsync(SubmitKycApplicationCommand command, CancellationToken cancellationToken = default);
    }
}
