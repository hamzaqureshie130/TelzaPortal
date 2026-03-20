using AutoMapper;
using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Application.Features.Kyc.Commands.SubmitKycApplication
{
    public class SubmitKycApplicationCommand : IRequest<KycApplicationDto>
    {
        public string UserId { get; set; } = string.Empty;
        public CompanyDetailsDto CompanyDetails { get; set; } = new();
        public BillingInformationDto BillingInformation { get; set; } = new();
        public List<ProductSelectionDto> ProductSelections { get; set; } = new();
        public TechnicalInformationDto TechnicalInformation { get; set; } = new();
    }

    public class SubmitKycApplicationCommandHandler : IRequestHandler<SubmitKycApplicationCommand, KycApplicationDto>
    {
        private readonly IKycRepository _kycRepository;
        private readonly IMapper _mapper;

        public SubmitKycApplicationCommandHandler(IKycRepository kycRepository, IMapper mapper)
        {
            _kycRepository = kycRepository;
            _mapper = mapper;
        }

        public async Task<KycApplicationDto> Handle(SubmitKycApplicationCommand request, CancellationToken cancellationToken)
        {
            var kyc = new KycApplication
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow,
                CompanyDetails = _mapper.Map<CompanyDetails>(request.CompanyDetails),
                BillingInformation = _mapper.Map<BillingInformation>(request.BillingInformation),
                TechnicalInformation = _mapper.Map<TechnicalInformation>(request.TechnicalInformation),
                ProductSelections = _mapper.Map<List<ProductSelection>>(request.ProductSelections)
            };

            // Link sub-entities to the parent KYC
            if (kyc.CompanyDetails != null) kyc.CompanyDetails.KycApplicationId = kyc.Id;
            if (kyc.BillingInformation != null) kyc.BillingInformation.KycApplicationId = kyc.Id;
            if (kyc.TechnicalInformation != null) kyc.TechnicalInformation.KycApplicationId = kyc.Id;
            foreach (var p in kyc.ProductSelections) p.KycApplicationId = kyc.Id;

            var created = await _kycRepository.AddAsync(kyc);
            var full = await _kycRepository.GetKycWithAllDetailsAsync(created.Id);
            return _mapper.Map<KycApplicationDto>(full);
        }
    }
}
