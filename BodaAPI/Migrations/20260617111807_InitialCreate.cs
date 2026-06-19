using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BodaAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Invitados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Alergias = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    NecesitaBus = table.Column<bool>(type: "boolean", nullable: false),
                    NecesitaAlojamiento = table.Column<bool>(type: "boolean", nullable: false),
                    TipoAlojamiento = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invitados", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VotosRegalos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Opcion = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    NombreInvitado = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    FechaVoto = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VotosRegalos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Acompanantes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Tipo = table.Column<string>(type: "text", nullable: false),
                    Alergias = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    InvitadoId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Acompanantes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Acompanantes_Invitados_InvitadoId",
                        column: x => x.InvitadoId,
                        principalTable: "Invitados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Acompanantes_InvitadoId",
                table: "Acompanantes",
                column: "InvitadoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Acompanantes");

            migrationBuilder.DropTable(
                name: "VotosRegalos");

            migrationBuilder.DropTable(
                name: "Invitados");
        }
    }
}
