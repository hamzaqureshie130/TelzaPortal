using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelzaProject.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddKycOnboardingExtensionsJson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OnboardingExtensionsJson",
                table: "KycApplications",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OnboardingExtensionsJson",
                table: "KycApplications");
        }
    }
}
