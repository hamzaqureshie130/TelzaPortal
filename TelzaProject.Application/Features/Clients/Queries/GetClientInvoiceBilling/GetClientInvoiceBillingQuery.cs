using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;

namespace TelzaProject.Application.Features.Clients.Queries.GetClientInvoiceBilling
{
    public class GetClientInvoiceBillingQuery : IRequest<ClientInvoiceBillingDto>
    {
        public Guid ClientId { get; set; }
    }

    public class GetClientInvoiceBillingQueryHandler : IRequestHandler<GetClientInvoiceBillingQuery, ClientInvoiceBillingDto>
    {
        private readonly IClientInvoiceBillingService _billingService;

        public GetClientInvoiceBillingQueryHandler(IClientInvoiceBillingService billingService)
        {
            _billingService = billingService;
        }

        public Task<ClientInvoiceBillingDto> Handle(GetClientInvoiceBillingQuery request, CancellationToken cancellationToken) =>
            _billingService.GetForClientAsync(request.ClientId, cancellationToken);
    }
}
