using MediatR;
using Microsoft.AspNetCore.Mvc;
using TelzaProject.Application.Features.Auth.Commands.Login;
using TelzaProject.Application.Features.Auth.Commands.Register;

namespace TelzaPortal.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>Login and receive a JWT token.</summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        /// <summary>Register a new user.</summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
