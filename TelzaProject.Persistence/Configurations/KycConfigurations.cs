using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Persistence.Configurations
{
    public class KycApplicationConfiguration : IEntityTypeConfiguration<KycApplication>
    {
        public void Configure(EntityTypeBuilder<KycApplication> builder)
        {
            builder.HasKey(k => k.Id);
            builder.Property(k => k.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.Property(k => k.UserId).IsRequired().HasMaxLength(450);
            builder.Property(k => k.Status).HasConversion<int>();
            builder.Property(k => k.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            builder.HasOne(k => k.CompanyDetails)
                   .WithOne(c => c.KycApplication)
                   .HasForeignKey<CompanyDetails>(c => c.KycApplicationId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(k => k.BillingInformation)
                   .WithOne(b => b.KycApplication)
                   .HasForeignKey<BillingInformation>(b => b.KycApplicationId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(k => k.TechnicalInformation)
                   .WithOne(t => t.KycApplication)
                   .HasForeignKey<TechnicalInformation>(t => t.KycApplicationId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(k => k.ProductSelections)
                   .WithOne(p => p.KycApplication)
                   .HasForeignKey(p => p.KycApplicationId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class CompanyDetailsConfiguration : IEntityTypeConfiguration<CompanyDetails>
    {
        public void Configure(EntityTypeBuilder<CompanyDetails> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.Property(c => c.CompanyName).IsRequired().HasMaxLength(300);
            builder.Property(c => c.Address).IsRequired().HasMaxLength(500);
            builder.Property(c => c.City).IsRequired().HasMaxLength(100);
            builder.Property(c => c.State).IsRequired().HasMaxLength(100);
            builder.Property(c => c.Country).IsRequired().HasMaxLength(100);
            builder.Property(c => c.ZipCode).IsRequired().HasMaxLength(20);
            builder.Property(c => c.BusinessLine).IsRequired().HasMaxLength(200);
            builder.Property(c => c.MobileNumber).IsRequired().HasMaxLength(50);
            builder.Property(c => c.TeamsOrWhatsApp).IsRequired().HasMaxLength(200);
            builder.Property(c => c.FilerID499).IsRequired().HasMaxLength(100);
            builder.Property(c => c.BusinessContactName).IsRequired().HasMaxLength(200);
            builder.Property(c => c.VoipPortalEmail).IsRequired().HasMaxLength(200);
            builder.Property(c => c.CorporateType).HasConversion<int>();
        }
    }

    public class BillingInformationConfiguration : IEntityTypeConfiguration<BillingInformation>
    {
        public void Configure(EntityTypeBuilder<BillingInformation> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.Property(b => b.BillingContactName).HasMaxLength(200);
            builder.Property(b => b.BillingEmail).HasMaxLength(200);
            builder.Property(b => b.BillingAddress).HasMaxLength(500);
            builder.Property(b => b.BillingCity).HasMaxLength(100);
            builder.Property(b => b.BillingState).HasMaxLength(100);
            builder.Property(b => b.BillingCountry).HasMaxLength(100);
            builder.Property(b => b.BillingZipCode).HasMaxLength(20);
            builder.Property(b => b.PaymentMethod).HasMaxLength(100);
            builder.Property(b => b.BankName).HasMaxLength(200);
            builder.Property(b => b.AccountName).HasMaxLength(200);
            builder.Property(b => b.AccountNumber).HasMaxLength(100);
            builder.Property(b => b.RoutingNumber).HasMaxLength(100);
        }
    }

    public class TechnicalInformationConfiguration : IEntityTypeConfiguration<TechnicalInformation>
    {
        public void Configure(EntityTypeBuilder<TechnicalInformation> builder)
        {
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.Property(t => t.DiallerServerLink).HasMaxLength(500);
            builder.Property(t => t.ValidationLink).HasMaxLength(500);
            builder.Property(t => t.ServerIPs).HasMaxLength(1000);
        }
    }

    public class ProductSelectionConfiguration : IEntityTypeConfiguration<ProductSelection>
    {
        public void Configure(EntityTypeBuilder<ProductSelection> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.Property(p => p.ProductType).HasConversion<int>();
            builder.Property(p => p.SpecificAreaCodes).HasMaxLength(500);
            builder.Property(p => p.BotServerInformation).HasMaxLength(1000);
            builder.Property(p => p.CloserDiallerDetails).HasMaxLength(1000);
        }
    }
}
