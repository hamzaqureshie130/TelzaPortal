using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelzaProject.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveKycBillingInformationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BillingInformation");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BillingInformation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    KycApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AccountName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    AccountNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BankName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    BillingAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    BillingCity = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BillingContactName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    BillingCountry = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BillingEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    BillingState = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BillingZipCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RoutingNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillingInformation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BillingInformation_KycApplications_KycApplicationId",
                        column: x => x.KycApplicationId,
                        principalTable: "KycApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BillingInformation_KycApplicationId",
                table: "BillingInformation",
                column: "KycApplicationId",
                unique: true);
        }
    }
}
