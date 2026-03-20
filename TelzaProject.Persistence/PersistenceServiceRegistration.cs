using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TelzaProject.Application.Contracts;
using TelzaProject.Persistence.Repositories;

namespace TelzaProject.Persistence
{
    public static class PersistenceServiceRegistration
    {
        public static IServiceCollection AddPersistenceServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<TelzaPortalDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("TelzaPortalDb")));

            services.AddScoped<IClientRepository, ClientRepository>();
            services.AddScoped<IInvoiceRepository, InvoiceRepository>();
            services.AddScoped<IInvoiceItemRepository, InvoiceItemRepository>();
            services.AddScoped<IKycRepository, KycRepository>();

            return services;
        }
    }
}
