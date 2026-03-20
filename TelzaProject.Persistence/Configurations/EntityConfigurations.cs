using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Persistence.Configurations
{
    public class ClientConfiguration : IEntityTypeConfiguration<Client>
    {
        public void Configure(EntityTypeBuilder<Client> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.Property(c => c.Name).IsRequired().HasMaxLength(200);
            builder.Property(c => c.Email).IsRequired().HasMaxLength(200);
            builder.Property(c => c.Phone).HasMaxLength(50);
            builder.Property(c => c.Address).HasMaxLength(500);
            builder.Property(c => c.Company).HasMaxLength(200);
            builder.Property(c => c.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            builder.HasMany(c => c.Invoices)
                   .WithOne(i => i.Client)
                   .HasForeignKey(i => i.ClientId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
    {
        public void Configure(EntityTypeBuilder<Invoice> builder)
        {
            builder.HasKey(i => i.Id);
            builder.Property(i => i.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.Property(i => i.InvoiceNumber).IsRequired().HasMaxLength(50);
            builder.Property(i => i.Status).IsRequired().HasMaxLength(50).HasDefaultValue("Draft");
            builder.Property(i => i.Subtotal).HasColumnType("decimal(18,2)");
            builder.Property(i => i.Tax).HasColumnType("decimal(18,2)");
            builder.Property(i => i.Total).HasColumnType("decimal(18,2)");
            builder.Property(i => i.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            builder.HasMany(i => i.InvoiceItems)
                   .WithOne(ii => ii.Invoice)
                   .HasForeignKey(ii => ii.InvoiceId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class InvoiceItemConfiguration : IEntityTypeConfiguration<InvoiceItem>
    {
        public void Configure(EntityTypeBuilder<InvoiceItem> builder)
        {
            builder.HasKey(ii => ii.Id);
            builder.Property(ii => ii.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            builder.Property(ii => ii.ItemName).IsRequired().HasMaxLength(300);
            builder.Property(ii => ii.UnitPrice).HasColumnType("decimal(18,2)");
            builder.Property(ii => ii.Total).HasColumnType("decimal(18,2)");
        }
    }
}
