using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelzaProject.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class EnsureTechnicalInformationDiallerLevel9AccessDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Idempotent repair: never reference legacy DiallerLevel9Access in UPDATE (catalog can disagree with
            // the real table after partial migrations). Add the new column if missing; drop the old bit if present.

            migrationBuilder.Sql(@"
DECLARE @ti int = OBJECT_ID(N'dbo.TechnicalInformation', N'U');
IF @ti IS NOT NULL
   AND EXISTS (
        SELECT 1 FROM sys.columns c WHERE c.object_id = @ti AND c.name = N'ServerIPs'
          AND c.system_type_id = 231 AND c.max_length = 2000)
BEGIN
    ALTER TABLE [dbo].[TechnicalInformation] ALTER COLUMN [ServerIPs] nvarchar(4000) NULL;
END");

            migrationBuilder.Sql(@"
DECLARE @ti int = OBJECT_ID(N'dbo.TechnicalInformation', N'U');
IF @ti IS NULL RETURN;

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = @ti AND name = N'DiallerLevel9AccessDetails')
BEGIN
    ALTER TABLE [dbo].[TechnicalInformation] ADD [DiallerLevel9AccessDetails] nvarchar(1000) NOT NULL
        CONSTRAINT [DF_TechnicalInformation_L9Repair] DEFAULT (N'');
END

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = @ti AND name = N'DiallerLevel9Access')
BEGIN
    ALTER TABLE [dbo].[TechnicalInformation] DROP COLUMN [DiallerLevel9Access];
END

IF EXISTS (
    SELECT 1 FROM sys.default_constraints
    WHERE parent_object_id = @ti AND name = N'DF_TechnicalInformation_L9Repair')
BEGIN
    ALTER TABLE [dbo].[TechnicalInformation] DROP CONSTRAINT [DF_TechnicalInformation_L9Repair];
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
