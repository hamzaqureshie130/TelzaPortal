using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Persistence.Configurations
{
    public class BankingInfoConfiguration : IEntityTypeConfiguration<BankingInfo>
    {
        public void Configure(EntityTypeBuilder<BankingInfo> builder)
        {
            builder.ToTable("banking_info");
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.HasIndex(b => b.CompanyId).IsUnique();
            builder.Property(b => b.BankName).HasMaxLength(300);
            builder.Property(b => b.BankAddress).HasMaxLength(500);
            builder.Property(b => b.ContactName).HasMaxLength(200);
            builder.Property(b => b.ContactPhone).HasMaxLength(50);
            builder.Property(b => b.ContactEmail).HasMaxLength(200);
            builder.Property(b => b.ContactFax).HasMaxLength(50);
            builder.Property(b => b.AccountNumber).HasMaxLength(100);

            builder.HasOne(b => b.Company)
                .WithOne(c => c.BankingInfo)
                .HasForeignKey<BankingInfo>(b => b.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
