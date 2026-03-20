using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.Exceptions;

namespace TelzaProject.Application.Features.InvoiceItems.Commands.DeleteInvoiceItem
{
    public class DeleteInvoiceItemCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeleteInvoiceItemCommandHandler : IRequestHandler<DeleteInvoiceItemCommand, Unit>
    {
        private readonly IInvoiceItemRepository _invoiceItemRepository;
        private readonly IInvoiceRepository _invoiceRepository;

        public DeleteInvoiceItemCommandHandler(
            IInvoiceItemRepository invoiceItemRepository,
            IInvoiceRepository invoiceRepository)
        {
            _invoiceItemRepository = invoiceItemRepository;
            _invoiceRepository = invoiceRepository;
        }

        public async Task<Unit> Handle(DeleteInvoiceItemCommand request, CancellationToken cancellationToken)
        {
            var item = await _invoiceItemRepository.GetByIdAsync(request.Id)
                ?? throw new NotFoundException(nameof(Domain.Entities.InvoiceItem), request.Id);

            var invoiceId = item.InvoiceId;
            await _invoiceItemRepository.DeleteAsync(item);

            // Recalculate invoice totals
            var invoice = await _invoiceRepository.GetInvoiceWithDetailsAsync(invoiceId);
            if (invoice != null)
            {
                var remainingItems = await _invoiceItemRepository.GetItemsByInvoiceIdAsync(invoiceId);
                invoice.Subtotal = remainingItems.Sum(i => i.Total);
                invoice.Total = invoice.Subtotal + invoice.Tax;
                await _invoiceRepository.UpdateAsync(invoice);
            }

            return Unit.Value;
        }
    }
}
