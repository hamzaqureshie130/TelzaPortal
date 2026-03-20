using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.Exceptions;

namespace TelzaProject.Application.Features.Clients.Commands.DeleteClient
{
    public class DeleteClientCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeleteClientCommandHandler : IRequestHandler<DeleteClientCommand, Unit>
    {
        private readonly IClientRepository _clientRepository;

        public DeleteClientCommandHandler(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        public async Task<Unit> Handle(DeleteClientCommand request, CancellationToken cancellationToken)
        {
            var client = await _clientRepository.GetByIdAsync(request.Id)
                ?? throw new NotFoundException(nameof(Domain.Entities.Client), request.Id);

            await _clientRepository.DeleteAsync(client);
            return Unit.Value;
        }
    }
}
