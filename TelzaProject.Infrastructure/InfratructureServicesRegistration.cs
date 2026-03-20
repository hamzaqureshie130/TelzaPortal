using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using TelzaProject.Application.Models;
using TelzaProject.Infrastructure.Mail;

namespace TelzaProject.Infrastructure
{
    public static class InfrastructureServicesRegistration
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services)
        {
            services.AddTransient<IEmailService, EmailService>();
            return services;
        }
    }
}
