using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;

namespace TelzaProject.Application.Features.Kyc.Queries.GetKycInvoiceBilling
{
    public class GetKycInvoiceBillingQuery : IRequest<ClientInvoiceBillingDto>
    {
        public Guid KycApplicationId { get; set; }
    }

    public class GetKycInvoiceBillingQueryHandler : IRequestHandler<GetKycInvoiceBillingQuery, ClientInvoiceBillingDto>
    {
        private readonly IClientInvoiceBillingService _billingService;

        public GetKycInvoiceBillingQueryHandler(IClientInvoiceBillingService billingService)
        {
            _billingService = billingService;
        }

        public Task<ClientInvoiceBillingDto> Handle(GetKycInvoiceBillingQuery request, CancellationToken cancellationToken) =>
            _billingService.GetForKycAsync(request.KycApplicationId, cancellationToken);
    }
}
