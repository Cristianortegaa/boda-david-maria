using BodaAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BodaAPI.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260619120000_AddAsisteColumn")]
    /// <inheritdoc />
    public partial class AddAsisteColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Asiste",
                table: "Invitados",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Asiste",
                table: "Invitados");
        }
    }
}
