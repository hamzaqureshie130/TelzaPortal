using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.Exceptions;

namespace TelzaProject.Application.Features.Invoices.Commands.DeleteInvoice
{
    public class DeleteInvoiceCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeleteInvoiceCommandHandler : IRequestHandler<DeleteInvoiceCommand, Unit>
    {
        private readonly IInvoiceRepository _invoiceRepository;

        public DeleteInvoiceCommandHandler(IInvoiceRepository invoiceRepository)
        {
            _invoiceRepository = invoiceRepository;
        }

        public async Task<Unit> Handle(DeleteInvoiceCommand request, CancellationToken cancellationToken)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(request.Id)
                ?? throw new NotFoundException(nameof(Domain.Entities.Invoice), request.Id);

            await _invoiceRepository.DeleteAsync(invoice);
            return Unit.Value;
        }
    }
}
