//using Microsoft.EntityFrameworkCore.Migrations;

//#nullable disable

//namespace API.Migrations
//{
//    /// <inheritdoc />
//    public partial class removefeatureid : Migration
//    {
//        /// <inheritdoc />
//        protected override void Up(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.DropForeignKey(
//                name: "FK_VehicleFeature_Features_FeatureId",
//                table: "VehicleFeature");

//            migrationBuilder.DropPrimaryKey(
//                name: "PK_Features",
//                table: "Features");

//            migrationBuilder.DropColumn(
//                name: "Id",
//                table: "Features");

//            migrationBuilder.AlterColumn<string>(
//                name: "Name",
//                table: "Features",
//                type: "nvarchar(450)",
//                nullable: false,
//                oldClrType: typeof(string),
//                oldType: "nvarchar(max)");

//            migrationBuilder.AddPrimaryKey(
//                name: "PK_Features",
//                table: "Features",
//                column: "Name");

//            migrationBuilder.AddForeignKey(
//                name: "FK_VehicleFeature_Features_FeatureId",
//                table: "VehicleFeature",
//                column: "FeatureId",
//                principalTable: "Features",
//                principalColumn: "Name",
//                onDelete: ReferentialAction.Cascade);
//        }

//        /// <inheritdoc />
//        protected override void Down(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.DropForeignKey(
//                name: "FK_VehicleFeature_Features_FeatureId",
//                table: "VehicleFeature");

//            migrationBuilder.DropPrimaryKey(
//                name: "PK_Features",
//                table: "Features");

//            migrationBuilder.AlterColumn<string>(
//                name: "Name",
//                table: "Features",
//                type: "nvarchar(max)",
//                nullable: false,
//                oldClrType: typeof(string),
//                oldType: "nvarchar(450)");

//            migrationBuilder.AddColumn<string>(
//                name: "Id",
//                table: "Features",
//                type: "nvarchar(450)",
//                nullable: false,
//                defaultValue: "");

//            migrationBuilder.AddPrimaryKey(
//                name: "PK_Features",
//                table: "Features",
//                column: "Id");

//            migrationBuilder.AddForeignKey(
//                name: "FK_VehicleFeature_Features_FeatureId",
//                table: "VehicleFeature",
//                column: "FeatureId",
//                principalTable: "Features",
//                principalColumn: "Id",
//                onDelete: ReferentialAction.Cascade);
//        }
//    }
//}
