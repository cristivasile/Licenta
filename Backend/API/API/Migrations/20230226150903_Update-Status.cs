using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VehicleStatus",
                table: "Statuses");

            migrationBuilder.AddColumn<bool>(
                name: "IsSold",
                table: "Statuses",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSold",
                table: "Statuses");

            migrationBuilder.AddColumn<string>(
                name: "VehicleStatus",
                table: "Statuses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
