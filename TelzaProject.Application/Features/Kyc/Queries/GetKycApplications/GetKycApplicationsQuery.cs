using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;

namespace TelzaProject.Application.Features.Kyc.Queries.GetKycApplications
{
    public class GetKycApplicationsQuery : IRequest<List<KycApplicationDto>> { }

    public class GetKycApplicationsQueryHandler : IRequestHandler<GetKycApplicationsQuery, List<KycApplicationDto>>
    {
        private readonly IKycRepository _kycRepository;
        private readonly IMapper _mapper;

        public GetKycApplicationsQueryHandler(IKycRepository kycRepository, IMapper mapper)
        {
            _kycRepository = kycRepository;
            _mapper = mapper;
        }

        public async Task<List<KycApplicationDto>> Handle(GetKycApplicationsQuery request, CancellationToken cancellationToken)
        {
            var kycs = await _kycRepository.GetAllKycsWithDetailsAsync();
            return _mapper.Map<List<KycApplicationDto>>(kycs);
        }
    }
}
