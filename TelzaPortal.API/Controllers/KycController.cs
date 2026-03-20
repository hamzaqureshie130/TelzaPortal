using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelzaProject.Application.Features.Kyc.Commands.SubmitKycApplication;
using TelzaProject.Application.Features.Kyc.Queries.GetKycApplicationDetails;
using TelzaProject.Application.Features.Kyc.Queries.GetKycApplications;
using TelzaProject.Application.Features.Kyc.Queries.GetMyKycApplication;

namespace TelzaPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/kyc")]
    public class KycController : ControllerBase
    {
        private readonly IMediator _mediator;

        public KycController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>Submit a new KYC application (Customer).</summary>
        [HttpPost]
        public async Task<IActionResult> Submit([FromBody] SubmitKycApplicationCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        /// <summary>Get my own KYC application (Customer).</summary>
        [HttpGet("my")]
        public async Task<IActionResult> GetMyKyc([FromQuery] string userId)
        {
            var result = await _mediator.Send(new GetMyKycApplicationQuery { UserId = userId });
            return Ok(result);
        }

        /// <summary>Get all KYC applications (Admin).</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetKycApplicationsQuery());
            return Ok(result);
        }

        /// <summary>Get a specific KYC application by ID (Admin).</summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetKycApplicationDetailsQuery { Id = id });
            return Ok(result);
        }
    }
}
