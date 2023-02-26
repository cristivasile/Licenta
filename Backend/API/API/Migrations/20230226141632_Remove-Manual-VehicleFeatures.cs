using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveManualVehicleFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VehicleFeature");

            migrationBuilder.CreateTable(
                name: "FeatureVehicle",
                columns: table => new
                {
                    FeaturesName = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    VehiclesId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeatureVehicle", x => new { x.FeaturesName, x.VehiclesId });
                    table.ForeignKey(
                        name: "FK_FeatureVehicle_Features_FeaturesName",
                        column: x => x.FeaturesName,
                        principalTable: "Features",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FeatureVehicle_Vehicles_VehiclesId",
                        column: x => x.VehiclesId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FeatureVehicle_VehiclesId",
                table: "FeatureVehicle",
                column: "VehiclesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeatureVehicle");

            migrationBuilder.CreateTable(
                name: "VehicleFeature",
                columns: table => new
                {
                    VehicleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FeatureName = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleFeature", x => new { x.VehicleId, x.FeatureName });
                    table.ForeignKey(
                        name: "FK_VehicleFeature_Features_FeatureName",
                        column: x => x.FeatureName,
                        principalTable: "Features",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VehicleFeature_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VehicleFeature_FeatureName",
                table: "VehicleFeature",
                column: "FeatureName");
        }
    }
}
