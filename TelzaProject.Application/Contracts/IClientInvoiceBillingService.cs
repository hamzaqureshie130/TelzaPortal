using TelzaProject.Application.DTOs;

namespace TelzaProject.Application.Contracts
{
    public interface IClientInvoiceBillingService
    {
        /// <summary>Resolves U.S. bank details for invoice billing from linked company or latest matching KYC JSON snapshot.</summary>
        Task<ClientInvoiceBillingDto> GetForClientAsync(Guid clientId, CancellationToken cancellationToken = default);

        /// <summary>Resolves billing from a specific KYC application JSON snapshot (same shape as create-invoice panel).</summary>
        Task<ClientInvoiceBillingDto> GetForKycAsync(Guid kycApplicationId, CancellationToken cancellationToken = default);
    }
}
