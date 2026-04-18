using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.Features.Clients.Commands.CreateClient;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Features.Kyc.Commands.SubmitKycApplication;
using TelzaProject.Application.Features.Kyc.Commands.UpdateKycApplicationStatus;
using TelzaProject.Application.Features.Kyc.Queries.GetKycApplicationDetails;
using TelzaProject.Application.Features.Kyc.Queries.GetKycApplications;
using TelzaProject.Application.Features.Kyc.Queries.GetKycInvoiceBilling;
using TelzaProject.Application.Features.Kyc.Queries.GetMyKycApplication;

namespace TelzaPortal.API.Controllers
{
    [ApiController]
    [Route("api/kyc")]
    public class KycController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IUserCompanyLinkService _userCompanyLinkService;
        private readonly ICompanyOnboardingPersistenceService _companyOnboardingPersistence;

        public KycController(
            IMediator mediator,
            IUserCompanyLinkService userCompanyLinkService,
            ICompanyOnboardingPersistenceService companyOnboardingPersistence)
        {
            _mediator = mediator;
            _userCompanyLinkService = userCompanyLinkService;
            _companyOnboardingPersistence = companyOnboardingPersistence;
        }

        /// <summary>
        /// Public KYC submission – no auth required. Saves KYC + auto-creates a Client record.
        /// </summary>
        [AllowAnonymous]
        [HttpPost("submit-public")]
        public async Task<IActionResult> SubmitPublic([FromBody] SubmitKycApplicationCommand command)
        {
            // Assign a guest userId if not provided
            if (string.IsNullOrWhiteSpace(command.UserId))
                command.UserId = $"guest-{Guid.NewGuid()}";

            var kyc = await _mediator.Send(command);

            if (command.CompanyDetails is not null)
                await _userCompanyLinkService.UpsertCompanyForUserAsync(command.UserId, command.CompanyDetails, command.CompanyBanking);

            await _companyOnboardingPersistence.SaveAsync(command);

            // Auto-create a Client record so the customer appears in the portal
            if (command.CompanyDetails is not null)
            {
                var cd = command.CompanyDetails;
                var createClient = new CreateClientCommand
                {
                    Name = cd.BusinessContactName,
                    Email = cd.VoipPortalEmail,
                    Phone = cd.BusinessPhone,
                    Company = cd.CompanyName,
                    Address = string.Join(", ", new[]
                    {
                        cd.Address, cd.City, cd.State, cd.ZipCode, cd.Country
                    }.Where(s => !string.IsNullOrWhiteSpace(s)))
                };
                await _mediator.Send(createClient);
            }

            return Ok(new { message = "KYC submitted successfully. Our team will contact you soon.", kycId = kyc.Id });
        }

        /// <summary>Submit a new KYC application (authenticated Customer).</summary>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Submit([FromBody] SubmitKycApplicationCommand command)
        {
            var result = await _mediator.Send(command);
            if (command.CompanyDetails is not null)
                await _userCompanyLinkService.UpsertCompanyForUserAsync(command.UserId, command.CompanyDetails, command.CompanyBanking);
            await _companyOnboardingPersistence.SaveAsync(command);
            return Ok(result);
        }

        /// <summary>Get my own KYC application (Customer).</summary>
        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyKyc([FromQuery] string userId)
        {
            var result = await _mediator.Send(new GetMyKycApplicationQuery { UserId = userId });
            return Ok(result);
        }

        /// <summary>Get all KYC applications (Admin).</summary>
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetKycApplicationsQuery());
            return Ok(result);
        }

        /// <summary>Billing fields for create-invoice from this KYC snapshot (must be before <c>GET {{id}}</c>).</summary>
        [Authorize]
        [HttpGet("{id:guid}/invoice-billing")]
        public async Task<IActionResult> GetInvoiceBilling(Guid id) =>
            Ok(await _mediator.Send(new GetKycInvoiceBillingQuery { KycApplicationId = id }));

        /// <summary>Get a specific KYC application by ID (Admin).</summary>
        [Authorize]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetKycApplicationDetailsQuery { Id = id });
            return Ok(result);
        }

        /// <summary>Update KYC application status (Admin).</summary>
        [Authorize]
        [HttpPatch("{id:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateKycStatusRequest body)
        {
            if (body == null) return BadRequest(new { message = "Request body is required." });

            var result = await _mediator.Send(new UpdateKycApplicationStatusCommand
            {
                Id = id,
                Status = body.Status,
            });
            return Ok(result);
        }
    }
}
