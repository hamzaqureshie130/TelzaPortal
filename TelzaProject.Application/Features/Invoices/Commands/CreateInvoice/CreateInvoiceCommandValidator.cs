using FluentValidation;

namespace TelzaProject.Application.Features.Invoices.Commands.CreateInvoice
{
    public class CreateInvoiceCommandValidator : AbstractValidator<CreateInvoiceCommand>
    {
        public CreateInvoiceCommandValidator()
        {
            RuleFor(x => x.ClientId).NotEmpty().WithMessage("Client is required.");

            RuleFor(x => x.InvoiceDate).NotEmpty().WithMessage("Invoice date is required.");

            RuleFor(x => x.Tax)
                .GreaterThanOrEqualTo(0).WithMessage("Tax cannot be negative.");

            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("Invoice must have at least one item.");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(i => i.ItemName).NotEmpty().WithMessage("Item name is required.");
                item.RuleFor(i => i.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than 0.");
                item.RuleFor(i => i.UnitPrice).GreaterThan(0).WithMessage("Unit price must be greater than 0.");
            });
        }
    }
}
