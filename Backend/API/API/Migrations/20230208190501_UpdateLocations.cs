using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLocations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Locations_LocationId",
                table: "Vehicles");

            migrationBuilder.DropForeignKey(
                name: "FK_WheelStock_Locations_LocationId",
                table: "WheelStock");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Locations",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "EmployeeNumber",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "Locations");

            migrationBuilder.RenameColumn(
                name: "LocationId",
                table: "Vehicles",
                newName: "LocationAddress");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicles_LocationId",
                table: "Vehicles",
                newName: "IX_Vehicles_LocationAddress");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Locations",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Locations",
                table: "Locations",
                column: "Address");

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Locations_LocationAddress",
                table: "Vehicles",
                column: "LocationAddress",
                principalTable: "Locations",
                principalColumn: "Address");

            migrationBuilder.AddForeignKey(
                name: "FK_WheelStock_Locations_LocationId",
                table: "WheelStock",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Address",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Locations_LocationAddress",
                table: "Vehicles");

            migrationBuilder.DropForeignKey(
                name: "FK_WheelStock_Locations_LocationId",
                table: "WheelStock");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Locations",
                table: "Locations");

            migrationBuilder.RenameColumn(
                name: "LocationAddress",
                table: "Vehicles",
                newName: "LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicles_LocationAddress",
                table: "Vehicles",
                newName: "IX_Vehicles_LocationId");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Locations",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "Locations",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "EmployeeNumber",
                table: "Locations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "Locations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Locations",
                table: "Locations",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Locations_LocationId",
                table: "Vehicles",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WheelStock_Locations_LocationId",
                table: "WheelStock",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
