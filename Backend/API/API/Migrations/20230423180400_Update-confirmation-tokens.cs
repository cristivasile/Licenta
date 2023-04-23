using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class Updateconfirmationtokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConfirmationToken_AspNetUsers_UserId",
                table: "ConfirmationToken");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ConfirmationToken",
                table: "ConfirmationToken");

            migrationBuilder.RenameTable(
                name: "ConfirmationToken",
                newName: "ConfirmationTokens");

            migrationBuilder.RenameIndex(
                name: "IX_ConfirmationToken_UserId",
                table: "ConfirmationTokens",
                newName: "IX_ConfirmationTokens_UserId");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreationTime",
                table: "ConfirmationTokens",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_ConfirmationTokens",
                table: "ConfirmationTokens",
                column: "Token");

            migrationBuilder.AddForeignKey(
                name: "FK_ConfirmationTokens_AspNetUsers_UserId",
                table: "ConfirmationTokens",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConfirmationTokens_AspNetUsers_UserId",
                table: "ConfirmationTokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ConfirmationTokens",
                table: "ConfirmationTokens");

            migrationBuilder.DropColumn(
                name: "CreationTime",
                table: "ConfirmationTokens");

            migrationBuilder.RenameTable(
                name: "ConfirmationTokens",
                newName: "ConfirmationToken");

            migrationBuilder.RenameIndex(
                name: "IX_ConfirmationTokens_UserId",
                table: "ConfirmationToken",
                newName: "IX_ConfirmationToken_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ConfirmationToken",
                table: "ConfirmationToken",
                column: "Token");

            migrationBuilder.AddForeignKey(
                name: "FK_ConfirmationToken_AspNetUsers_UserId",
                table: "ConfirmationToken",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
