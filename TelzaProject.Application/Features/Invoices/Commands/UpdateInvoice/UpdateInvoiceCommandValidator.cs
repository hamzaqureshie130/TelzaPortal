using FluentValidation;

namespace TelzaProject.Application.Features.Invoices.Commands.UpdateInvoice
{
    public class UpdateInvoiceCommandValidator : AbstractValidator<UpdateInvoiceCommand>
    {
        public UpdateInvoiceCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Invoice Id is required.");
            RuleFor(x => x.ClientId).NotEmpty().WithMessage("Client is required.");
            RuleFor(x => x.InvoiceDate).NotEmpty().WithMessage("Invoice date is required.");
            RuleFor(x => x.Tax).GreaterThanOrEqualTo(0).WithMessage("Tax cannot be negative.");
            RuleFor(x => x.Status).NotEmpty().WithMessage("Status is required.");
        }
    }
}
