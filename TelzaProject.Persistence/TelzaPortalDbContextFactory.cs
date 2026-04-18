using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TelzaProject.Persistence
{
    public class TelzaPortalDbContextFactory : IDesignTimeDbContextFactory<TelzaPortalDbContext>
    {
        public TelzaPortalDbContext CreateDbContext(string[] args)
        {
            var apiFolder = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "TelzaPortal.API"));
            var basePath = Directory.Exists(apiFolder) ? apiFolder : Directory.GetCurrentDirectory();

            var config = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var builder = new DbContextOptionsBuilder<TelzaPortalDbContext>();
            var connectionString = config.GetConnectionString("TelzaPortalDb");
            builder.UseSqlServer(connectionString);

            return new TelzaPortalDbContext(builder.Options);
        }
    }
}
