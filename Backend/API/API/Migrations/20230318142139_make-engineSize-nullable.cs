using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class makeengineSizenullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "EngineSize",
                table: "Vehicles",
                type: "int",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "EngineSize",
                table: "Vehicles",
                type: "real",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
