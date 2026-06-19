// BodaAPI/Models/Acompanante.cs
using System.ComponentModel.DataAnnotations;

namespace BodaAPI.Models;

public enum TipoAcompanante
{
    Adulto,
    Nino,   // 3-12 años
    Bebe    // 0-2 años
}

public class Acompanante
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;

    public TipoAcompanante Tipo { get; set; } = TipoAcompanante.Adulto;

    [MaxLength(500)]
    public string? Alergias { get; set; }

    // FK
    public int InvitadoId { get; set; }
    public Invitado Invitado { get; set; } = null!;
}
