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
    public string? TipoAlojamiento { get; set; }  // "hotel", "casa_rural", etc.

    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

    public ICollection<Acompanante> Acompanantes { get; set; } = new List<Acompanante>();
}
