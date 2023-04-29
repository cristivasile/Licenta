using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class Fixnames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VehicleView_AspNetUsers_UserID",
                table: "VehicleView");

            migrationBuilder.DropForeignKey(
                name: "FK_VehicleView_Vehicles_VehicleID",
                table: "VehicleView");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VehicleView",
                table: "VehicleView");

            migrationBuilder.RenameTable(
                name: "VehicleView",
                newName: "VehicleViews");

            migrationBuilder.RenameColumn(
                name: "VehicleID",
                table: "VehicleViews",
                newName: "VehicleId");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "VehicleViews",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_VehicleView_VehicleID",
                table: "VehicleViews",
                newName: "IX_VehicleViews_VehicleId");

            migrationBuilder.RenameIndex(
                name: "IX_VehicleView_UserID",
                table: "VehicleViews",
                newName: "IX_VehicleViews_UserId");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "VehicleViews",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_VehicleViews",
                table: "VehicleViews",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VehicleViews_AspNetUsers_UserId",
                table: "VehicleViews",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VehicleViews_Vehicles_VehicleId",
                table: "VehicleViews",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VehicleViews_AspNetUsers_UserId",
                table: "VehicleViews");

            migrationBuilder.DropForeignKey(
                name: "FK_VehicleViews_Vehicles_VehicleId",
                table: "VehicleViews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VehicleViews",
                table: "VehicleViews");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "VehicleViews");

            migrationBuilder.RenameTable(
                name: "VehicleViews",
                newName: "VehicleView");

            migrationBuilder.RenameColumn(
                name: "VehicleId",
                table: "VehicleView",
                newName: "VehicleID");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "VehicleView",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_VehicleViews_VehicleId",
                table: "VehicleView",
                newName: "IX_VehicleView_VehicleID");

            migrationBuilder.RenameIndex(
                name: "IX_VehicleViews_UserId",
                table: "VehicleView",
                newName: "IX_VehicleView_UserID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VehicleView",
                table: "VehicleView",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VehicleView_AspNetUsers_UserID",
                table: "VehicleView",
                column: "UserID",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VehicleView_Vehicles_VehicleID",
                table: "VehicleView",
                column: "VehicleID",
                principalTable: "Vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
