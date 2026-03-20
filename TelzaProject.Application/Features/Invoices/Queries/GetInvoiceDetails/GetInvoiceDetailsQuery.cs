using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Exceptions;

namespace TelzaProject.Application.Features.Invoices.Queries.GetInvoiceDetails
{
    public class GetInvoiceDetailsQuery : IRequest<InvoiceDto>
    {
        public Guid Id { get; set; }
    }

    public class GetInvoiceDetailsQueryHandler : IRequestHandler<GetInvoiceDetailsQuery, InvoiceDto>
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IMapper _mapper;

        public GetInvoiceDetailsQueryHandler(IInvoiceRepository invoiceRepository, IMapper mapper)
        {
            _invoiceRepository = invoiceRepository;
            _mapper = mapper;
        }

        public async Task<InvoiceDto> Handle(GetInvoiceDetailsQuery request, CancellationToken cancellationToken)
        {
            var invoice = await _invoiceRepository.GetInvoiceWithDetailsAsync(request.Id)
                ?? throw new NotFoundException(nameof(Domain.Entities.Invoice), request.Id);

            return _mapper.Map<InvoiceDto>(invoice);
        }
    }
}
