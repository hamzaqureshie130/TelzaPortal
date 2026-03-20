using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Exceptions;

namespace TelzaProject.Application.Features.Kyc.Queries.GetKycApplicationDetails
{
    public class GetKycApplicationDetailsQuery : IRequest<KycApplicationDto>
    {
        public Guid Id { get; set; }
    }

    public class GetKycApplicationDetailsQueryHandler : IRequestHandler<GetKycApplicationDetailsQuery, KycApplicationDto>
    {
        private readonly IKycRepository _kycRepository;
        private readonly IMapper _mapper;

        public GetKycApplicationDetailsQueryHandler(IKycRepository kycRepository, IMapper mapper)
        {
            _kycRepository = kycRepository;
            _mapper = mapper;
        }

        public async Task<KycApplicationDto> Handle(GetKycApplicationDetailsQuery request, CancellationToken cancellationToken)
        {
            var kyc = await _kycRepository.GetKycWithAllDetailsAsync(request.Id)
                ?? throw new NotFoundException(nameof(Domain.Entities.KycApplication), request.Id);

            return _mapper.Map<KycApplicationDto>(kyc);
        }
    }
}
