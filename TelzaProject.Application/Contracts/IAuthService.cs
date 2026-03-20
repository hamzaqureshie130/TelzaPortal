using TelzaProject.Application.DTOs.Auth;

namespace TelzaProject.Application.Contracts
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    }
}
