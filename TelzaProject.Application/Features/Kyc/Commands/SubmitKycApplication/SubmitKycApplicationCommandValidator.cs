using FluentValidation;

namespace TelzaProject.Application.Features.Kyc.Commands.SubmitKycApplication
{
    public class SubmitKycApplicationCommandValidator : AbstractValidator<SubmitKycApplicationCommand>
    {
        public SubmitKycApplicationCommandValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().WithMessage("UserId is required.");

            RuleFor(x => x.CompanyDetails).NotNull().WithMessage("Company details are required.");

            When(x => x.CompanyDetails != null, () =>
            {
                RuleFor(x => x.CompanyDetails.CompanyName).NotEmpty().WithMessage("Company name is required.");
                RuleFor(x => x.CompanyDetails.Address).NotEmpty().WithMessage("Address is required.");
                RuleFor(x => x.CompanyDetails.City).NotEmpty().WithMessage("City is required.");
                RuleFor(x => x.CompanyDetails.State).NotEmpty().WithMessage("State is required.");
                RuleFor(x => x.CompanyDetails.Country).NotEmpty().WithMessage("Country is required.");
                RuleFor(x => x.CompanyDetails.ZipCode).NotEmpty().WithMessage("ZIP code is required.");
                RuleFor(x => x.CompanyDetails.BusinessLine).NotEmpty().WithMessage("Business line is required.");
                RuleFor(x => x.CompanyDetails.MobileNumber).NotEmpty().WithMessage("Mobile number is required.");
                RuleFor(x => x.CompanyDetails.TeamsOrWhatsApp).NotEmpty().WithMessage("Teams ID or WhatsApp account is required.");
                RuleFor(x => x.CompanyDetails.FilerID499).NotEmpty().WithMessage("499 Filer ID is required.");
                RuleFor(x => x.CompanyDetails.BusinessContactName).NotEmpty().WithMessage("Business contact name is required.");
                RuleFor(x => x.CompanyDetails.VoipPortalEmail)
                    .NotEmpty().WithMessage("VoIP Portal email is required.")
                    .EmailAddress().WithMessage("Invalid VoIP Portal email format.");
            });

            RuleFor(x => x.ProductSelections).NotEmpty().WithMessage("Please select at least one product.");

            RuleForEach(x => x.ProductSelections).ChildRules(p =>
            {
                p.RuleFor(s => s.ProductType).IsInEnum().WithMessage("Invalid product type.");
            });
        }
    }
}
