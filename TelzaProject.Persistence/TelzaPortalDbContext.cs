using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TelzaProject.Domain.Entities;
using TelzaProject.Persistence.Identity;

namespace TelzaProject.Persistence
{
    public class TelzaPortalDbContext : IdentityDbContext<ApplicationUser>
    {
        public TelzaPortalDbContext(DbContextOptions<TelzaPortalDbContext> options)
            : base(options) { }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }

        public DbSet<Company> Companies { get; set; }
        public DbSet<BankingInfo> BankingInfos { get; set; }
        public DbSet<TradeReference> TradeReferences { get; set; }
        public DbSet<RegulatoryCompliance> RegulatoryCompliances { get; set; }
        public DbSet<ProductOrder> ProductOrders { get; set; }
        public DbSet<CompanyTechnicalInfo> CompanyTechnicalInfos { get; set; }
        public DbSet<CompanyAttestation> CompanyAttestations { get; set; }
        public DbSet<KycApplication> KycApplications { get; set; }
        public DbSet<CompanyDetails> CompanyDetails { get; set; }
        public DbSet<ProductSelection> ProductSelections { get; set; }
        public DbSet<TechnicalInformation> TechnicalInformation { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(typeof(TelzaPortalDbContext).Assembly);
        }
    }
}
