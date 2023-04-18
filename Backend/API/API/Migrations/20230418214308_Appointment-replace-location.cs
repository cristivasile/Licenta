using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class Appointmentreplacelocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Locations_LocationId",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "LocationId",
                table: "Appointments",
                newName: "VehicleId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_LocationId",
                table: "Appointments",
                newName: "IX_Appointments_VehicleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Vehicles_VehicleId",
                table: "Appointments",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Vehicles_VehicleId",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "VehicleId",
                table: "Appointments",
                newName: "LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_VehicleId",
                table: "Appointments",
                newName: "IX_Appointments_LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Locations_LocationId",
                table: "Appointments",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
