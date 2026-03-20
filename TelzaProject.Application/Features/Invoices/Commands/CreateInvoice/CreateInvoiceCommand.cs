using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;

namespace TelzaProject.Application.Features.Invoices.Commands.CreateInvoice
{
    public class CreateInvoiceCommand : IRequest<InvoiceDto>
    {
        public Guid ClientId { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal Tax { get; set; }
        public string Status { get; set; } = "Draft";
        public List<CreateInvoiceItemDto> Items { get; set; } = new();
    }

    public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, InvoiceDto>
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IInvoiceItemRepository _invoiceItemRepository;
        private readonly IMapper _mapper;

        public CreateInvoiceCommandHandler(
            IInvoiceRepository invoiceRepository,
            IInvoiceItemRepository invoiceItemRepository,
            IMapper mapper)
        {
            _invoiceRepository = invoiceRepository;
            _invoiceItemRepository = invoiceItemRepository;
            _mapper = mapper;
        }

        public async Task<InvoiceDto> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
        {
            var createDto = _mapper.Map<CreateInvoiceDto>(request);
            var invoice = _mapper.Map<Domain.Entities.Invoice>(createDto);

            invoice.InvoiceNumber = await _invoiceRepository.GenerateInvoiceNumberAsync();

            // Map and calculate items
            var items = _mapper.Map<List<Domain.Entities.InvoiceItem>>(request.Items);
            items.ForEach(i => i.InvoiceId = invoice.Id);

            invoice.Subtotal = items.Sum(i => i.Total);
            invoice.Total = invoice.Subtotal + invoice.Tax;

            var created = await _invoiceRepository.AddAsync(invoice);

            // Add items after invoice is persisted
            items.ForEach(i => i.InvoiceId = created.Id);
            await _invoiceItemRepository.AddRangeAsync(items);

            // Return full invoice with items
            var fullInvoice = await _invoiceRepository.GetInvoiceWithDetailsAsync(created.Id);
            return _mapper.Map<InvoiceDto>(fullInvoice);
        }
    }
}
