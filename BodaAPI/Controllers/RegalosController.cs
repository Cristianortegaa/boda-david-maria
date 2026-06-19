// BodaAPI/Controllers/RegalosController.cs
using BodaAPI.Data;
using BodaAPI.DTOs;
using BodaAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BodaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegalosController(ApplicationDbContext db) : ControllerBase
{
    private static readonly List<string> OpcionesDisponibles =
    [
        "Viaje de novios",
        "La granja de PinyPon",
        "Tablero de Parchís y Oca",
        "Bote de proteínas",
        "Paté PREMIUM para los gatos"
    ];

    // GET api/regalos/opciones
    [HttpGet("opciones")]
    public IActionResult GetOpciones() => Ok(OpcionesDisponibles);

    // GET api/regalos/votos  →  [{opcion, votos}]
    [HttpGet("votos")]
    public async Task<IActionResult> GetVotos()
    {
        // Agrupar votos reales
        var votosDb = await db.VotosRegalos
            .GroupBy(v => v.Opcion)
            .Select(g => new { opcion = g.Key, votos = g.Count() })
            .ToListAsync();

        // Rellenar con 0 las opciones sin votos para devolver siempre las 5
        var resultado = OpcionesDisponibles
            .Select(op => new
            {
                opcion = op,
                votos  = votosDb.FirstOrDefault(v => v.opcion == op)?.votos ?? 0
            });

        return Ok(resultado);
    }

    // POST api/regalos/votar  →  acepta múltiples opciones por invitado
    [HttpPost("votar")]
    public async Task<IActionResult> Votar([FromBody] VotoRegaloDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        if (dto.Opciones.Count == 0) return BadRequest(new { error = "Elige al menos una opción." });

        foreach (var opcion in dto.Opciones)
        {
            if (!OpcionesDisponibles.Contains(opcion))
                return BadRequest(new { error = $"Opción no válida: {opcion}" });

            db.VotosRegalos.Add(new VotoRegalo
            {
                Opcion         = opcion,
                NombreInvitado = dto.NombreInvitado.Trim()
            });
        }

        await db.SaveChangesAsync();
        return Ok(new { mensaje = "¡Votos registrados!" });
    }
}
