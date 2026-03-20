using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;

namespace TelzaProject.Application.Features.Clients.Commands.CreateClient
{
    public class CreateClientCommand : IRequest<ClientDto>
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
    }

    public class CreateClientCommandHandler : IRequestHandler<CreateClientCommand, ClientDto>
    {
        private readonly IClientRepository _clientRepository;
        private readonly IMapper _mapper;

        public CreateClientCommandHandler(IClientRepository clientRepository, IMapper mapper)
        {
            _clientRepository = clientRepository;
            _mapper = mapper;
        }

        public async Task<ClientDto> Handle(CreateClientCommand request, CancellationToken cancellationToken)
        {
            var createDto = _mapper.Map<CreateClientDto>(request);
            var client = _mapper.Map<Domain.Entities.Client>(createDto);
            var created = await _clientRepository.AddAsync(client);
            return _mapper.Map<ClientDto>(created);
        }
    }
}
