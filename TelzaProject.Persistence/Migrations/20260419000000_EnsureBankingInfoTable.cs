using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelzaProject.Persistence.Migrations
{
    /// <summary>Idempotent: creates banking_info if an earlier empty migration was applied without DDL.</summary>
    public partial class EnsureBankingInfoTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'[dbo].[banking_info]'))
BEGIN
    CREATE TABLE [dbo].[banking_info] (
        [Id] uniqueidentifier NOT NULL CONSTRAINT [DF_banking_info_Id] DEFAULT NEWSEQUENTIALID(),
        [CompanyId] uniqueidentifier NOT NULL,
        [HasUsBankAccount] bit NOT NULL,
        [BankName] nvarchar(300) NULL,
        [BankAddress] nvarchar(500) NULL,
        [ContactName] nvarchar(200) NULL,
        [ContactPhone] nvarchar(50) NULL,
        [ContactEmail] nvarchar(200) NULL,
        [ContactFax] nvarchar(50) NULL,
        [AccountNumber] nvarchar(100) NULL,
        CONSTRAINT [PK_banking_info] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_banking_info_Companies_CompanyId] FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[Companies] ([Id]) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX [IX_banking_info_CompanyId] ON [dbo].[banking_info] ([CompanyId]);
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
