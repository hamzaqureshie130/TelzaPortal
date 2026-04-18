using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelzaProject.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ExpandCompanyProfileCompaniesApplicationUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "BusinessLine",
                table: "CompanyDetails",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AddColumn<string>(
                name: "BillingAccountingEmail",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "BusinessBasedInUs",
                table: "CompanyDetails",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "BusinessLicenseNumber",
                table: "CompanyDetails",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BusinessPhone",
                table: "CompanyDetails",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CompanyContactName",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ComplianceEmail",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerFax",
                table: "CompanyDetails",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerMainPhone",
                table: "CompanyDetails",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerUrl",
                table: "CompanyDetails",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfIncorporation",
                table: "CompanyDetails",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmailForBalances",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmailForNotices",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmailForRates",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FeinNumber",
                table: "CompanyDetails",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FraudReportEmail",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FrnNumber",
                table: "CompanyDetails",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LegalEmail",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MailingAddress",
                table: "CompanyDetails",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MailingCityStateZip",
                table: "CompanyDetails",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MobilePhoneSeparate",
                table: "CompanyDetails",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtherDesignatedNames",
                table: "CompanyDetails",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryMainEmail",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SkypeId",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StateOfIncorporation",
                table: "CompanyDetails",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupportNocEmail",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "AspNetUsers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CompanyName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    OtherDesignatedNames = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ZipCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    MailingAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MailingCityStateZip = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    BusinessBasedInUs = table.Column<bool>(type: "bit", nullable: false),
                    StateOfIncorporation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DateOfIncorporation = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BusinessLicenseNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    FeinNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FrnNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CorporateType = table.Column<int>(type: "int", nullable: false),
                    BusinessLine = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    MobileNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TeamsOrWhatsApp = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FilerID499 = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BusinessContactName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    BusinessPhone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MobilePhoneSeparate = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EmailForRates = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    EmailForNotices = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    EmailForBalances = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    VoipPortalEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CustomerMainPhone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CustomerFax = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CustomerUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CompanyContactName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    PrimaryMainEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    BillingAccountingEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SupportNocEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    LegalEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ComplianceEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    FraudReportEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SkypeId = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_CompanyId",
                table: "AspNetUsers",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Companies_CompanyId",
                table: "AspNetUsers",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Companies_CompanyId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_CompanyId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "BillingAccountingEmail",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "BusinessBasedInUs",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "BusinessLicenseNumber",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "BusinessPhone",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "CompanyContactName",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "ComplianceEmail",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "CustomerFax",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "CustomerMainPhone",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "CustomerUrl",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "DateOfIncorporation",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "EmailForBalances",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "EmailForNotices",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "EmailForRates",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "FeinNumber",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "FraudReportEmail",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "FrnNumber",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "LegalEmail",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "MailingAddress",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "MailingCityStateZip",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "MobilePhoneSeparate",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "OtherDesignatedNames",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "PrimaryMainEmail",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "SkypeId",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "StateOfIncorporation",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "SupportNocEmail",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "BusinessLine",
                table: "CompanyDetails",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);
        }
    }
}
