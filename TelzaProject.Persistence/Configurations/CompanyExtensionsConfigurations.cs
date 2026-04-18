using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Persistence.Configurations
{
    public class TradeReferenceConfiguration : IEntityTypeConfiguration<TradeReference>
    {
        public void Configure(EntityTypeBuilder<TradeReference> builder)
        {
            builder.ToTable("trade_references");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.Property(x => x.TradeReferenceName).IsRequired().HasMaxLength(300);
            builder.Property(x => x.TradeReferenceAddress).IsRequired().HasMaxLength(500);
            builder.Property(x => x.TradeReferenceNumber).HasMaxLength(100);
            builder.Property(x => x.ContactName).IsRequired().HasMaxLength(200);
            builder.Property(x => x.ContactEmail).IsRequired().HasMaxLength(200);
            builder.Property(x => x.ContactPhone).IsRequired().HasMaxLength(50);
            builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            builder.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            builder.HasOne(x => x.Company)
                .WithMany(c => c.TradeReferences)
                .HasForeignKey(x => x.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class RegulatoryComplianceConfiguration : IEntityTypeConfiguration<RegulatoryCompliance>
    {
        public void Configure(EntityTypeBuilder<RegulatoryCompliance> builder)
        {
            builder.ToTable("regulatory_compliance");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.HasIndex(x => x.CompanyId).IsUnique();
            builder.Property(x => x.BusinessDescriptionJson).HasMaxLength(4000);
            builder.Property(x => x.BusinessDescriptionOtherText).HasMaxLength(500);
            builder.Property(x => x.IntermediateProviderRegistryCompanyName).IsRequired().HasMaxLength(300);
            builder.Property(x => x.StirShakenCertCompanyName).IsRequired().HasMaxLength(300);
            builder.Property(x => x.OcnStirShakenHeader).IsRequired().HasMaxLength(100);
            builder.Property(x => x.Fcc499FilerId).IsRequired().HasMaxLength(100);
            builder.Property(x => x.RobocallMitigationListedCompanyName).HasMaxLength(300);
            builder.Property(x => x.RobocallMitigationDatabaseNumber).HasMaxLength(100);
            builder.Property(x => x.EstimatedAsrPercent).HasPrecision(5, 2);
            builder.Property(x => x.EstimatedAloc).HasPrecision(10, 2);
            builder.Property(x => x.EstimatedUnallocated404Percent).HasPrecision(5, 2);
            builder.Property(x => x.EstimatedCancel487Percent).HasPrecision(5, 2);
            builder.Property(x => x.EstimatedShortDurationPercent).HasPrecision(5, 2);
            builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            builder.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            builder.HasOne(x => x.Company)
                .WithOne(c => c.RegulatoryCompliance)
                .HasForeignKey<RegulatoryCompliance>(x => x.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class ProductOrderConfiguration : IEntityTypeConfiguration<ProductOrder>
    {
        public void Configure(EntityTypeBuilder<ProductOrder> builder)
        {
            builder.ToTable("product_orders");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.Property(x => x.ProductType).HasConversion<int>();
            builder.Property(x => x.SubfieldsJson).IsRequired().HasColumnType("nvarchar(max)");
            builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            builder.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            builder.HasOne(x => x.Company)
                .WithMany(c => c.ProductOrders)
                .HasForeignKey(x => x.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class CompanyTechnicalInfoConfiguration : IEntityTypeConfiguration<CompanyTechnicalInfo>
    {
        public void Configure(EntityTypeBuilder<CompanyTechnicalInfo> builder)
        {
            builder.ToTable("technical_info");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.HasIndex(x => x.CompanyId).IsUnique();
            builder.Property(x => x.DiallerServerLink).HasMaxLength(500);
            builder.Property(x => x.ValidationLink).IsRequired().HasMaxLength(500);
            builder.Property(x => x.ServerIPs).IsRequired().HasMaxLength(4000);
            builder.Property(x => x.DiallerLevel9Access).IsRequired().HasMaxLength(1000);
            builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            builder.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            builder.HasOne(x => x.Company)
                .WithOne(c => c.TechnicalInfoProfile)
                .HasForeignKey<CompanyTechnicalInfo>(x => x.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class CompanyAttestationConfiguration : IEntityTypeConfiguration<CompanyAttestation>
    {
        public void Configure(EntityTypeBuilder<CompanyAttestation> builder)
        {
            builder.ToTable("company_attestations");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.HasIndex(x => x.CompanyId).IsUnique();
            builder.Property(x => x.OfficerName).IsRequired().HasMaxLength(200);
            builder.Property(x => x.SignatureText).IsRequired().HasMaxLength(500);
            builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            builder.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            builder.HasOne(x => x.Company)
                .WithOne(c => c.Attestation)
                .HasForeignKey<CompanyAttestation>(x => x.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
