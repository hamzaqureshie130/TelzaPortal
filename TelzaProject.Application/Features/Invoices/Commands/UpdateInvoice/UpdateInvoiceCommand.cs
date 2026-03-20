using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Exceptions;

namespace TelzaProject.Application.Features.Invoices.Commands.UpdateInvoice
{
    public class UpdateInvoiceCommand : IRequest<InvoiceDto>
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal Tax { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class UpdateInvoiceCommandHandler : IRequestHandler<UpdateInvoiceCommand, InvoiceDto>
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IMapper _mapper;

        public UpdateInvoiceCommandHandler(IInvoiceRepository invoiceRepository, IMapper mapper)
        {
            _invoiceRepository = invoiceRepository;
            _mapper = mapper;
        }

        public async Task<InvoiceDto> Handle(UpdateInvoiceCommand request, CancellationToken cancellationToken)
        {
            var invoice = await _invoiceRepository.GetInvoiceWithDetailsAsync(request.Id)
                ?? throw new NotFoundException(nameof(Domain.Entities.Invoice), request.Id);

            invoice.ClientId = request.ClientId;
            invoice.InvoiceDate = request.InvoiceDate;
            invoice.Tax = request.Tax;
            invoice.Status = request.Status;
            invoice.Total = invoice.Subtotal + request.Tax;

            await _invoiceRepository.UpdateAsync(invoice);

            var updated = await _invoiceRepository.GetInvoiceWithDetailsAsync(invoice.Id);
            return _mapper.Map<InvoiceDto>(updated);
        }
    }
}
