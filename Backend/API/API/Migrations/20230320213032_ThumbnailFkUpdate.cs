using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class ThumbnailFkUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Thumbnails_ThumbnailId",
                table: "Vehicles");
            
            migrationBuilder.DropIndex(
                name: "IX_Vehicles_ThumbnailId",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "ThumbnailId",
                table: "Vehicles");

            migrationBuilder.AddColumn<string>(
                name: "VehicleId",
                table: "Thumbnails",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Thumbnails_VehicleId",
                table: "Thumbnails",
                column: "VehicleId",
                unique: true,
                filter: "[VehicleId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Thumbnails_Vehicles_VehicleId",
                table: "Thumbnails",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Thumbnails_Vehicles_VehicleId",
                table: "Thumbnails");

            migrationBuilder.DropIndex(
                name: "IX_Thumbnails_VehicleId",
                table: "Thumbnails");

            migrationBuilder.DropColumn(
                name: "VehicleId",
                table: "Thumbnails");

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailId",
                table: "Vehicles",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_ThumbnailId",
                table: "Vehicles",
                column: "ThumbnailId",
                unique: true,
                filter: "[ThumbnailId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Thumbnails_ThumbnailId",
                table: "Vehicles",
                column: "ThumbnailId",
                principalTable: "Thumbnails",
                principalColumn: "Id");
        }
    }
}
