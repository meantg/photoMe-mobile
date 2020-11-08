using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace photoMe_api.Migrations
{
    public partial class ChangethumbnailphototothumbnailpublicId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Albums_AlbumId1",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_AlbumId1",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "AlbumId1",
                table: "Photos");

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailPublicId",
                table: "Albums",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbnailPublicId",
                table: "Albums");

            migrationBuilder.AddColumn<Guid>(
                name: "AlbumId1",
                table: "Photos",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_AlbumId1",
                table: "Photos",
                column: "AlbumId1",
                unique: true,
                filter: "[AlbumId1] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Albums_AlbumId1",
                table: "Photos",
                column: "AlbumId1",
                principalTable: "Albums",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
