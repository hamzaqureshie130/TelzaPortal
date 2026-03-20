using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Exceptions;

namespace TelzaProject.Application.Features.Clients.Queries.GetClientDetails
{
    public class GetClientDetailsQuery : IRequest<ClientDto>
    {
        public Guid Id { get; set; }
    }

    public class GetClientDetailsQueryHandler : IRequestHandler<GetClientDetailsQuery, ClientDto>
    {
        private readonly IClientRepository _clientRepository;
        private readonly IMapper _mapper;

        public GetClientDetailsQueryHandler(IClientRepository clientRepository, IMapper mapper)
        {
            _clientRepository = clientRepository;
            _mapper = mapper;
        }

        public async Task<ClientDto> Handle(GetClientDetailsQuery request, CancellationToken cancellationToken)
        {
            var client = await _clientRepository.GetByIdAsync(request.Id)
                ?? throw new NotFoundException(nameof(Domain.Entities.Client), request.Id);

            return _mapper.Map<ClientDto>(client);
        }
    }
}
