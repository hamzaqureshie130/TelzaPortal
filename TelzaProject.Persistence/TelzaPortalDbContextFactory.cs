using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TelzaProject.Persistence
{
    public class TelzaPortalDbContextFactory : IDesignTimeDbContextFactory<TelzaPortalDbContext>
    {
        public TelzaPortalDbContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var builder = new DbContextOptionsBuilder<TelzaPortalDbContext>();
            var connectionString = config.GetConnectionString("TelzaPortalDb");
            builder.UseSqlServer(connectionString);

            return new TelzaPortalDbContext(builder.Options);
        }
    }
}
