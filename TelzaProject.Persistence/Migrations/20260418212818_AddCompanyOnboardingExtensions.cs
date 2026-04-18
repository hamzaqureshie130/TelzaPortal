using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelzaProject.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyOnboardingExtensions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiallerLevel9Access",
                table: "TechnicalInformation");

            migrationBuilder.AlterColumn<string>(
                name: "ServerIPs",
                table: "TechnicalInformation",
                type: "nvarchar(4000)",
                maxLength: 4000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DiallerLevel9AccessDetails",
                table: "TechnicalInformation",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "company_attestations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OfficerName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SignatureText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_company_attestations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_company_attestations_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "product_orders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductType = table.Column<int>(type: "int", nullable: false),
                    SubfieldsJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_product_orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_product_orders_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "regulatory_compliance",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BusinessDescriptionJson = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    BusinessDescriptionOtherText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IntermediateProviderRegistryCompanyName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    StirShakenCertCompanyName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    OcnStirShakenHeader = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Fcc499FilerId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RobocallMitigationRegistered = table.Column<bool>(type: "bit", nullable: false),
                    RobocallMitigationListedCompanyName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    RobocallMitigationDatabaseNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    StirShakenRmdImplemented = table.Column<bool>(type: "bit", nullable: false),
                    SigningAllCalls = table.Column<bool>(type: "bit", nullable: false),
                    ComplianceUsBankAccount = table.Column<bool>(type: "bit", nullable: false),
                    OriginateConversationalTraffic = table.Column<bool>(type: "bit", nullable: false),
                    OriginateAutodialedTraffic = table.Column<bool>(type: "bit", nullable: false),
                    DirectAutodialClients = table.Column<bool>(type: "bit", nullable: false),
                    NonUsAutodialSources = table.Column<bool>(type: "bit", nullable: false),
                    ItgTracingEngaged = table.Column<bool>(type: "bit", nullable: false),
                    MoreThanThreeTracebacksLastYear = table.Column<bool>(type: "bit", nullable: false),
                    MoreThanFourGovImpersonationTracebacks = table.Column<bool>(type: "bit", nullable: false),
                    NonCooperativeVspByUsTelecom = table.Column<bool>(type: "bit", nullable: false),
                    BlockedFromNetworkLastTwoYears = table.Column<bool>(type: "bit", nullable: false),
                    AdverseJudgementUnlawfulRobocalls = table.Column<bool>(type: "bit", nullable: false),
                    EstimatedAsrPercent = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    EstimatedAloc = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    EstimatedUnallocated404Percent = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    EstimatedCancel487Percent = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    EstimatedShortDurationPercent = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_regulatory_compliance", x => x.Id);
                    table.ForeignKey(
                        name: "FK_regulatory_compliance_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "technical_info",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DiallerServerLink = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ValidationLink = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ServerIPs = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    DiallerLevel9Access = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_technical_info", x => x.Id);
                    table.ForeignKey(
                        name: "FK_technical_info_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "trade_references",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TradeReferenceName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TradeReferenceAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    TradeReferenceNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ContactName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ContactEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ContactPhone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trade_references", x => x.Id);
                    table.ForeignKey(
                        name: "FK_trade_references_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_company_attestations_CompanyId",
                table: "company_attestations",
                column: "CompanyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_product_orders_CompanyId",
                table: "product_orders",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_regulatory_compliance_CompanyId",
                table: "regulatory_compliance",
                column: "CompanyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_technical_info_CompanyId",
                table: "technical_info",
                column: "CompanyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_trade_references_CompanyId",
                table: "trade_references",
                column: "CompanyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "company_attestations");

            migrationBuilder.DropTable(
                name: "product_orders");

            migrationBuilder.DropTable(
                name: "regulatory_compliance");

            migrationBuilder.DropTable(
                name: "technical_info");

            migrationBuilder.DropTable(
                name: "trade_references");

            migrationBuilder.DropColumn(
                name: "DiallerLevel9AccessDetails",
                table: "TechnicalInformation");

            migrationBuilder.AlterColumn<string>(
                name: "ServerIPs",
                table: "TechnicalInformation",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(4000)",
                oldMaxLength: 4000,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DiallerLevel9Access",
                table: "TechnicalInformation",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
