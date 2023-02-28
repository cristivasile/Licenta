//using Microsoft.EntityFrameworkCore.Migrations;

//#nullable disable

//namespace API.Migrations
//{
//    /// <inheritdoc />
//    public partial class addstatuspurchasedby : Migration
//    {
//        /// <inheritdoc />
//        protected override void Up(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.AddColumn<string>(
//                name: "PurchaserUserId",
//                table: "Statuses",
//                type: "nvarchar(450)",
//                nullable: true);

//            migrationBuilder.CreateIndex(
//                name: "IX_Statuses_PurchaserUserId",
//                table: "Statuses",
//                column: "PurchaserUserId");

//            migrationBuilder.AddForeignKey(
//                name: "FK_Statuses_AspNetUsers_PurchaserUserId",
//                table: "Statuses",
//                column: "PurchaserUserId",
//                principalTable: "AspNetUsers",
//                principalColumn: "Id");
//        }

//        /// <inheritdoc />
//        protected override void Down(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.DropForeignKey(
//                name: "FK_Statuses_AspNetUsers_PurchaserUserId",
//                table: "Statuses");

//            migrationBuilder.DropIndex(
//                name: "IX_Statuses_PurchaserUserId",
//                table: "Statuses");

//            migrationBuilder.DropColumn(
//                name: "PurchaserUserId",
//                table: "Statuses");
//        }
//    }
//}
