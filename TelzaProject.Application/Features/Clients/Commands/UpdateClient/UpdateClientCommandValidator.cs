using FluentValidation;

namespace TelzaProject.Application.Features.Clients.Commands.UpdateClient
{
    public class UpdateClientCommandValidator : AbstractValidator<UpdateClientCommand>
    {
        public UpdateClientCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Client Id is required.");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Client name is required.").MaximumLength(200);
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Invalid email format.");
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Phone is required.");
        }
    }
}
