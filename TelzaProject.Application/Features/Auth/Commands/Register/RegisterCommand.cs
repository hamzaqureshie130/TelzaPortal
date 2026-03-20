using MediatR;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs.Auth;

namespace TelzaProject.Application.Features.Auth.Commands.Register
{
    public class RegisterCommand : IRequest<AuthResponseDto>
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? UserName { get; set; }
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
    {
        private readonly IAuthService _authService;

        public RegisterCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var registerDto = new RegisterDto
            {
                Email = request.Email,
                Password = request.Password,
                UserName = request.UserName
            };
            return await _authService.RegisterAsync(registerDto);
        }
    }
}
