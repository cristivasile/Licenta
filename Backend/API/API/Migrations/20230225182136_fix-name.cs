using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class Fixname : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VehicleFeature_Features_FeatureId",
                table: "VehicleFeature");

            migrationBuilder.RenameColumn(
                name: "FeatureId",
                table: "VehicleFeature",
                newName: "FeatureName");

            migrationBuilder.RenameIndex(
                name: "IX_VehicleFeature_FeatureId",
                table: "VehicleFeature",
                newName: "IX_VehicleFeature_FeatureName");

            migrationBuilder.AddForeignKey(
                name: "FK_VehicleFeature_Features_FeatureName",
                table: "VehicleFeature",
                column: "FeatureName",
                principalTable: "Features",
                principalColumn: "Name",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VehicleFeature_Features_FeatureName",
                table: "VehicleFeature");

            migrationBuilder.RenameColumn(
                name: "FeatureName",
                table: "VehicleFeature",
                newName: "FeatureId");

            migrationBuilder.RenameIndex(
                name: "IX_VehicleFeature_FeatureName",
                table: "VehicleFeature",
                newName: "IX_VehicleFeature_FeatureId");

            migrationBuilder.AddForeignKey(
                name: "FK_VehicleFeature_Features_FeatureId",
                table: "VehicleFeature",
                column: "FeatureId",
                principalTable: "Features",
                principalColumn: "Name",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
