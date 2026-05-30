using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelzaProject.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class v3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AiBotCampaign",
                table: "ProductSelections",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AiBotScript",
                table: "ProductSelections",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DiallerSettings",
                table: "ProductSelections",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfCampaigns",
                table: "ProductSelections",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Campaign",
                table: "CompanyDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Rmd",
                table: "CompanyDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VendorType",
                table: "CompanyDetails",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AiBotCampaign",
                table: "ProductSelections");

            migrationBuilder.DropColumn(
                name: "AiBotScript",
                table: "ProductSelections");

            migrationBuilder.DropColumn(
                name: "DiallerSettings",
                table: "ProductSelections");

            migrationBuilder.DropColumn(
                name: "NumberOfCampaigns",
                table: "ProductSelections");

            migrationBuilder.DropColumn(
                name: "Campaign",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "Rmd",
                table: "CompanyDetails");

            migrationBuilder.DropColumn(
                name: "VendorType",
                table: "CompanyDetails");
        }
    }
}
