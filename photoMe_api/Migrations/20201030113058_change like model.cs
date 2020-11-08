using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace photoMe_api.Migrations
{
    public partial class changelikemodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Users_LikeeId",
                table: "Likes");

            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Users_LikerId",
                table: "Likes");

            migrationBuilder.DropIndex(
                name: "IX_Likes_LikeeId",
                table: "Likes");

            migrationBuilder.DropIndex(
                name: "IX_Likes_LikerId",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "LikeeId",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "LikerId",
                table: "Likes");

            migrationBuilder.AddColumn<Guid>(
                name: "AlbumId",
                table: "Likes",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "MakerId",
                table: "Likes",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Likes_AlbumId",
                table: "Likes",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_Likes_MakerId",
                table: "Likes",
                column: "MakerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Albums_AlbumId",
                table: "Likes",
                column: "AlbumId",
                principalTable: "Albums",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Users_MakerId",
                table: "Likes",
                column: "MakerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Albums_AlbumId",
                table: "Likes");

            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Users_MakerId",
                table: "Likes");

            migrationBuilder.DropIndex(
                name: "IX_Likes_AlbumId",
                table: "Likes");

            migrationBuilder.DropIndex(
                name: "IX_Likes_MakerId",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "AlbumId",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "MakerId",
                table: "Likes");

            migrationBuilder.AddColumn<Guid>(
                name: "LikeeId",
                table: "Likes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LikerId",
                table: "Likes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Likes_LikeeId",
                table: "Likes",
                column: "LikeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Likes_LikerId",
                table: "Likes",
                column: "LikerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Users_LikeeId",
                table: "Likes",
                column: "LikeeId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Users_LikerId",
                table: "Likes",
                column: "LikerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
