//using Microsoft.EntityFrameworkCore.Migrations;

//#nullable disable

//namespace API.Migrations
//{
//    /// <inheritdoc />
//    public partial class refactorvehiclesfixed : Migration
//    {
//        /// <inheritdoc />
//        protected override void Up(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.DropForeignKey(
//                name: "FK_Vehicles_Brands_BrandName",
//                table: "Vehicles");

//            migrationBuilder.DropForeignKey(
//                name: "FK_Vehicles_Models_ModelId",
//                table: "Vehicles");

//            migrationBuilder.DropTable(
//                name: "Models");

//            migrationBuilder.DropTable(
//                name: "Brands");

//            migrationBuilder.DropIndex(
//                name: "IX_Vehicles_BrandName",
//                table: "Vehicles");

//            migrationBuilder.DropIndex(
//                name: "IX_Vehicles_ModelId",
//                table: "Vehicles");

//            migrationBuilder.RenameColumn(
//                name: "ModelId",
//                table: "Vehicles",
//                newName: "Model");

//            migrationBuilder.RenameColumn(
//                name: "BrandName",
//                table: "Vehicles",
//                newName: "Brand");

//            migrationBuilder.CreateTable(
//                name: "VehicleTypes",
//                columns: table => new
//                {
//                    Brand = table.Column<string>(type: "nvarchar(450)", nullable: false),
//                    Model = table.Column<string>(type: "nvarchar(450)", nullable: false)
//                },
//                constraints: table =>
//                {
//                    table.PrimaryKey("PK_VehicleTypes", x => new { x.Brand, x.Model });
//                });

//            migrationBuilder.CreateIndex(
//                name: "IX_Vehicles_Brand_Model",
//                table: "Vehicles",
//                columns: new[] { "Brand", "Model" });

//            migrationBuilder.AddForeignKey(
//                name: "FK_Vehicles_VehicleTypes_Brand_Model",
//                table: "Vehicles",
//                columns: new[] { "Brand", "Model" },
//                principalTable: "VehicleTypes",
//                principalColumns: new[] { "Brand", "Model" },
//                onDelete: ReferentialAction.Cascade);
//        }

//        /// <inheritdoc />
//        protected override void Down(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.DropForeignKey(
//                name: "FK_Vehicles_VehicleTypes_Brand_Model",
//                table: "Vehicles");

//            migrationBuilder.DropTable(
//                name: "VehicleTypes");

//            migrationBuilder.DropIndex(
//                name: "IX_Vehicles_Brand_Model",
//                table: "Vehicles");

//            migrationBuilder.RenameColumn(
//                name: "Model",
//                table: "Vehicles",
//                newName: "ModelId");

//            migrationBuilder.RenameColumn(
//                name: "Brand",
//                table: "Vehicles",
//                newName: "BrandName");

//            migrationBuilder.CreateTable(
//                name: "Brands",
//                columns: table => new
//                {
//                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false)
//                },
//                constraints: table =>
//                {
//                    table.PrimaryKey("PK_Brands", x => x.Name);
//                });

//            migrationBuilder.CreateTable(
//                name: "Models",
//                columns: table => new
//                {
//                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
//                    BrandName = table.Column<string>(type: "nvarchar(450)", nullable: false),
//                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
//                },
//                constraints: table =>
//                {
//                    table.PrimaryKey("PK_Models", x => x.Id);
//                    table.ForeignKey(
//                        name: "FK_Models_Brands_BrandName",
//                        column: x => x.BrandName,
//                        principalTable: "Brands",
//                        principalColumn: "Name",
//                        onDelete: ReferentialAction.Cascade);
//                });

//            migrationBuilder.CreateIndex(
//                name: "IX_Vehicles_BrandName",
//                table: "Vehicles",
//                column: "BrandName");

//            migrationBuilder.CreateIndex(
//                name: "IX_Vehicles_ModelId",
//                table: "Vehicles",
//                column: "ModelId");

//            migrationBuilder.CreateIndex(
//                name: "IX_Models_BrandName",
//                table: "Models",
//                column: "BrandName");

//            migrationBuilder.AddForeignKey(
//                name: "FK_Vehicles_Brands_BrandName",
//                table: "Vehicles",
//                column: "BrandName",
//                principalTable: "Brands",
//                principalColumn: "Name",
//                onDelete: ReferentialAction.Cascade);

//            migrationBuilder.AddForeignKey(
//                name: "FK_Vehicles_Models_ModelId",
//                table: "Vehicles",
//                column: "ModelId",
//                principalTable: "Models",
//                principalColumn: "Id",
//                onDelete: ReferentialAction.Cascade);
//        }
//    }
//}
