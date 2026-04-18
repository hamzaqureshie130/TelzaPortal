using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TelzaProject.Application.Contracts;
using TelzaProject.Application.DTOs.Auth;
using TelzaProject.Application.Exceptions;
using TelzaProject.Identity.Models;
using TelzaProject.Persistence.Identity;

namespace TelzaProject.Identity.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtSettings _jwtSettings;

        public AuthService(UserManager<ApplicationUser> userManager, IOptions<JwtSettings> jwtSettings)
        {
            _userManager = userManager;
            _jwtSettings = jwtSettings.Value;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email)
                ?? throw new BadRequestException("Invalid email or password.");

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordValid)
                throw new BadRequestException("Invalid email or password.");

            var roles = await _userManager.GetRolesAsync(user);
            var token = GenerateJwtToken(user, roles);

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email!,
                UserName = user.UserName!,
                UserId = user.Id,
                Roles = roles.ToList(),
                Expiration = DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes)
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var userExists = await _userManager.FindByEmailAsync(registerDto.Email);
            if (userExists != null)
                throw new BadRequestException("User with this email already exists.");

            var user = new ApplicationUser
            {
                Email = registerDto.Email,
                UserName = registerDto.UserName ?? registerDto.Email,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new BadRequestException($"Registration failed: {errors}");
            }

            // Assign a default role if needed (optional, assuming 'Customer' role exists or we just proceed)
            // await _userManager.AddToRoleAsync(user, "Customer");

            var token = GenerateJwtToken(user, new List<string>());

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                UserName = user.UserName,
                UserId = user.Id,
                Roles = new List<string>(),
                Expiration = DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes)
            };
        }

        private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
