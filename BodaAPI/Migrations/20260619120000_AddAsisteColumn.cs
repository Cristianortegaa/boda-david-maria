using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BodaAPI.Migrations
{
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
