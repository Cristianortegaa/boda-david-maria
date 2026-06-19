// BodaAPI/Controllers/InvitadosController.cs
using BodaAPI.Data;
using BodaAPI.DTOs;
using BodaAPI.Models;
using BodaAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BodaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvitadosController(
    ApplicationDbContext db,
    IEmailService emailService,
    IExcelExportService excelService,
    IConfiguration config,
    ILogger<InvitadosController> logger) : ControllerBase
{
    // POST api/invitados
    [HttpPost]
    public async Task<IActionResult> Registrar([FromBody] InvitadoRegistroDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Mapeo DTO → Entidades
        var invitado = new Invitado
        {
            Nombre            = dto.Nombre.Trim(),
            Alergias          = dto.Alergias?.Trim(),
            NecesitaBus       = dto.NecesitaBus,
            NecesitaAlojamiento = dto.NecesitaAlojamiento,
            TipoAlojamiento   = dto.TipoAlojamiento,
            Acompanantes      = dto.Acompanantes.Select(a => new Acompanante
            {
                Nombre   = a.Nombre.Trim(),
                Tipo     = Enum.TryParse<TipoAcompanante>(a.Tipo, out var t) ? t : TipoAcompanante.Adulto,
                Alergias = a.Alergias?.Trim()
            }).ToList()
        };

        db.Invitados.Add(invitado);
        await db.SaveChangesAsync();

        logger.LogInformation("Invitado registrado: {Nombre} (Id={Id})", invitado.Nombre, invitado.Id);

        // Servicios paralelos (fire-and-forget con await para loguear errores)
        await Task.WhenAll(
            emailService.EnviarConfirmacionInvitadoAsync(invitado.Nombre, "novios@boda.com"),
            emailService.EnviarNotificacionAdminAsync(invitado.Nombre),
            excelService.ActualizarExcelInvitadosAsync(invitado)
        );

        return CreatedAtAction(nameof(GetById), new { id = invitado.Id }, new { invitado.Id });
    }

    // POST api/invitados/no-asiste
    [HttpPost("no-asiste")]
    public async Task<IActionResult> NoAsiste([FromBody] NoAsisteDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var invitado = new Invitado
        {
            Nombre       = dto.Nombre.Trim(),
            Asiste       = false,
            NecesitaBus  = false,
            NecesitaAlojamiento = false
        };

        db.Invitados.Add(invitado);
        await db.SaveChangesAsync();

        logger.LogInformation("No asistirá: {Nombre} (Id={Id})", invitado.Nombre, invitado.Id);

        await emailService.EnviarConfirmacionInvitadoAsync($"❌ {invitado.Nombre} no puede asistir", "");

        return Ok(new { invitado.Id });
    }

    // GET api/invitados/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var inv = await db.Invitados
            .Include(i => i.Acompanantes)
            .FirstOrDefaultAsync(i => i.Id == id);

        return inv is null ? NotFound() : Ok(inv);
    }

    // GET api/invitados  (uso interno / admin)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var lista = await db.Invitados
            .Include(i => i.Acompanantes)
            .OrderBy(i => i.FechaRegistro)
            .ToListAsync();
        return Ok(lista);
    }

    // GET api/invitados/export?key=SECRET  → descarga el Excel con todos los invitados
    [HttpGet("export")]
    public async Task<IActionResult> ExportExcel([FromQuery] string key)
    {
        var expectedKey = config["ExcelExport:AdminKey"];
        if (string.IsNullOrWhiteSpace(key) || key != expectedKey)
            return Unauthorized(new { error = "Clave incorrecta." });

        var lista = await db.Invitados
            .Include(i => i.Acompanantes)
            .OrderBy(i => i.FechaRegistro)
            .ToListAsync();

        var bytes = excelService.GenerarExcel(lista);
        var filename = $"invitados_{DateTime.UtcNow:yyyyMMdd}.xlsx";
        return File(bytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename);
    }
}
