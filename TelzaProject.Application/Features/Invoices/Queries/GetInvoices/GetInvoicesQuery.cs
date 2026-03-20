using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;

namespace TelzaProject.Application.Features.Invoices.Queries.GetInvoices
{
    public class GetInvoicesQuery : IRequest<List<InvoiceDto>> { }

    public class GetInvoicesQueryHandler : IRequestHandler<GetInvoicesQuery, List<InvoiceDto>>
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IMapper _mapper;

        public GetInvoicesQueryHandler(IInvoiceRepository invoiceRepository, IMapper mapper)
        {
            _invoiceRepository = invoiceRepository;
            _mapper = mapper;
        }

        public async Task<List<InvoiceDto>> Handle(GetInvoicesQuery request, CancellationToken cancellationToken)
        {
            var invoices = await _invoiceRepository.GetInvoicesWithClientAsync();
            return _mapper.Map<List<InvoiceDto>>(invoices);
        }
    }
}
