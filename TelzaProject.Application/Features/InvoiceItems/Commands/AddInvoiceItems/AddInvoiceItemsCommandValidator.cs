using FluentValidation;

namespace TelzaProject.Application.Features.InvoiceItems.Commands.AddInvoiceItems
{
    public class AddInvoiceItemsCommandValidator : AbstractValidator<AddInvoiceItemsCommand>
    {
        public AddInvoiceItemsCommandValidator()
        {
            RuleFor(x => x.InvoiceId).NotEmpty().WithMessage("Invoice Id is required.");
            RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(i => i.ItemName).NotEmpty().WithMessage("Item name is required.");
                item.RuleFor(i => i.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than 0.");
                item.RuleFor(i => i.UnitPrice).GreaterThan(0).WithMessage("Unit price must be greater than 0.");
            });
        }
    }
}
