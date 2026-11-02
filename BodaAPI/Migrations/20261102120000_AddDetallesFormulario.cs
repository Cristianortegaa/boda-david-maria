using BodaAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BodaAPI.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20261102120000_AddDetallesFormulario")]
    /// <inheritdoc />
    public partial class AddDetallesFormulario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdaTransporte",
                table: "Invitados",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VueltaTransporte",
                table: "Invitados",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comportamiento",
                table: "Invitados",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Mensaje",
                table: "Invitados",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "IdaTransporte",    table: "Invitados");
            migrationBuilder.DropColumn(name: "VueltaTransporte", table: "Invitados");
            migrationBuilder.DropColumn(name: "Comportamiento",   table: "Invitados");
            migrationBuilder.DropColumn(name: "Mensaje",          table: "Invitados");
        }
    }
}
