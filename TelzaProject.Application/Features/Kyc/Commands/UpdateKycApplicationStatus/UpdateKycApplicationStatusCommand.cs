using FluentValidation;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Exceptions;
using TelzaProject.Application.Features.Kyc.Queries.GetKycApplicationDetails;
using TelzaProject.Domain.Enums;

namespace TelzaProject.Application.Features.Kyc.Commands.UpdateKycApplicationStatus
{
    public class UpdateKycApplicationStatusCommand : IRequest<KycApplicationDto>
    {
        public Guid Id { get; set; }
        public KycStatus Status { get; set; }
    }

    public class UpdateKycApplicationStatusCommandValidator : AbstractValidator<UpdateKycApplicationStatusCommand>
    {
        public UpdateKycApplicationStatusCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Status).IsInEnum();
        }
    }

    public class UpdateKycApplicationStatusCommandHandler : IRequestHandler<UpdateKycApplicationStatusCommand, KycApplicationDto>
    {
        private readonly IKycRepository _kycRepository;
        private readonly IMediator _mediator;

        public UpdateKycApplicationStatusCommandHandler(IKycRepository kycRepository, IMediator mediator)
        {
            _kycRepository = kycRepository;
            _mediator = mediator;
        }

        public async Task<KycApplicationDto> Handle(UpdateKycApplicationStatusCommand request, CancellationToken cancellationToken)
        {
            var updated = await _kycRepository.UpdateStatusAsync(request.Id, request.Status, cancellationToken);
            if (!updated)
                throw new NotFoundException(nameof(Domain.Entities.KycApplication), request.Id);

            return await _mediator.Send(new GetKycApplicationDetailsQuery { Id = request.Id }, cancellationToken);
        }
    }
}
