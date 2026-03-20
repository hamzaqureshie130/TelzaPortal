using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Exceptions;

namespace TelzaProject.Application.Features.Kyc.Queries.GetMyKycApplication
{
    public class GetMyKycApplicationQuery : IRequest<KycApplicationDto>
    {
        public string UserId { get; set; } = string.Empty;
    }

    public class GetMyKycApplicationQueryHandler : IRequestHandler<GetMyKycApplicationQuery, KycApplicationDto>
    {
        private readonly IKycRepository _kycRepository;
        private readonly IMapper _mapper;

        public GetMyKycApplicationQueryHandler(IKycRepository kycRepository, IMapper mapper)
        {
            _kycRepository = kycRepository;
            _mapper = mapper;
        }

        public async Task<KycApplicationDto> Handle(GetMyKycApplicationQuery request, CancellationToken cancellationToken)
        {
            var kyc = await _kycRepository.GetKycByUserIdAsync(request.UserId)
                ?? throw new NotFoundException("KycApplication", $"user {request.UserId}");

            return _mapper.Map<KycApplicationDto>(kyc);
        }
    }
}
