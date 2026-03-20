using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Persistence
{
    public class TelzaPortalDbContext : IdentityDbContext
    {
        public TelzaPortalDbContext(DbContextOptions<TelzaPortalDbContext> options)
            : base(options) { }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }

        public DbSet<KycApplication> KycApplications { get; set; }
        public DbSet<CompanyDetails> CompanyDetails { get; set; }
        public DbSet<BillingInformation> BillingInformation { get; set; }
        public DbSet<ProductSelection> ProductSelections { get; set; }
        public DbSet<TechnicalInformation> TechnicalInformation { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(typeof(TelzaPortalDbContext).Assembly);
        }
    }
}
