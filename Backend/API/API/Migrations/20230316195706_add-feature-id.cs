using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
#pragma warning disable CS8981 // The type name only contains lower-cased ascii characters. Such names may become reserved for the language.
    public partial class addfeatureid : Migration
#pragma warning restore CS8981 // The type name only contains lower-cased ascii characters. Such names may become reserved for the language.
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FeatureVehicle_Features_FeaturesName",
                table: "FeatureVehicle");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Features",
                table: "Features");

            migrationBuilder.RenameColumn(
                name: "FeaturesName",
                table: "FeatureVehicle",
                newName: "FeaturesId");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "Features",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Features",
                table: "Features",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Features_Name",
                table: "Features",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FeatureVehicle_Features_FeaturesId",
                table: "FeatureVehicle",
                column: "FeaturesId",
                principalTable: "Features",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FeatureVehicle_Features_FeaturesId",
                table: "FeatureVehicle");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Features",
                table: "Features");

            migrationBuilder.DropIndex(
                name: "IX_Features_Name",
                table: "Features");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Features");

            migrationBuilder.RenameColumn(
                name: "FeaturesId",
                table: "FeatureVehicle",
                newName: "FeaturesName");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Features",
                table: "Features",
                column: "Name");

            migrationBuilder.AddForeignKey(
                name: "FK_FeatureVehicle_Features_FeaturesName",
                table: "FeatureVehicle",
                column: "FeaturesName",
                principalTable: "Features",
                principalColumn: "Name",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
