// BodaAPI/Models/Invitado.cs
using System.ComponentModel.DataAnnotations;

namespace BodaAPI.Models;

public class Invitado
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Alergias { get; set; }

    public bool NecesitaBus { get; set; }

    public bool NecesitaAlojamiento { get; set; }

    [MaxLength(100)]
    public string? TipoAlojamiento { get; set; }  // "viernes-sabado" | "sabado"

    [MaxLength(20)]
    public string? IdaTransporte { get; set; }     // "autobus" | "coche"

    [MaxLength(20)]
    public string? VueltaTransporte { get; set; }  // "autobus" | "coche"

    [MaxLength(500)]
    public string? Comportamiento { get; set; }    // "¿Cómo vas a portarte?" (opciones separadas por coma)

    [MaxLength(1000)]
    public string? Mensaje { get; set; }           // "¿Algo que añadir?"

    public bool Asiste { get; set; } = true;

    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

    public ICollection<Acompanante> Acompanantes { get; set; } = new List<Acompanante>();
}
