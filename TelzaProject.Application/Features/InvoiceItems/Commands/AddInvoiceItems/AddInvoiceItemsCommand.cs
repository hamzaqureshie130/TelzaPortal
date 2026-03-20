using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Exceptions;

namespace TelzaProject.Application.Features.InvoiceItems.Commands.AddInvoiceItems
{
    public class AddInvoiceItemsCommand : IRequest<List<InvoiceItemDto>>
    {
        public Guid InvoiceId { get; set; }
        public List<CreateInvoiceItemDto> Items { get; set; } = new();
    }

    public class AddInvoiceItemsCommandHandler : IRequestHandler<AddInvoiceItemsCommand, List<InvoiceItemDto>>
    {
        private readonly IInvoiceItemRepository _invoiceItemRepository;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IMapper _mapper;

        public AddInvoiceItemsCommandHandler(
            IInvoiceItemRepository invoiceItemRepository,
            IInvoiceRepository invoiceRepository,
            IMapper mapper)
        {
            _invoiceItemRepository = invoiceItemRepository;
            _invoiceRepository = invoiceRepository;
            _mapper = mapper;
        }

        public async Task<List<InvoiceItemDto>> Handle(AddInvoiceItemsCommand request, CancellationToken cancellationToken)
        {
            var invoice = await _invoiceRepository.GetInvoiceWithDetailsAsync(request.InvoiceId)
                ?? throw new NotFoundException(nameof(Domain.Entities.Invoice), request.InvoiceId);

            var items = _mapper.Map<List<Domain.Entities.InvoiceItem>>(request.Items);
            items.ForEach(i => i.InvoiceId = request.InvoiceId);

            await _invoiceItemRepository.AddRangeAsync(items);

            // Recalculate invoice totals
            var allItems = await _invoiceItemRepository.GetItemsByInvoiceIdAsync(request.InvoiceId);
            invoice.Subtotal = allItems.Sum(i => i.Total);
            invoice.Total = invoice.Subtotal + invoice.Tax;
            await _invoiceRepository.UpdateAsync(invoice);

            return _mapper.Map<List<InvoiceItemDto>>(items);
        }
    }
}
