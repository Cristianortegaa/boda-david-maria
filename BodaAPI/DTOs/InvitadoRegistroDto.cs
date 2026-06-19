// BodaAPI/DTOs/InvitadoRegistroDto.cs
using System.ComponentModel.DataAnnotations;

namespace BodaAPI.DTOs;

// JSON exacto que Angular envía al POST /api/invitados al final del paso 6
public class InvitadoRegistroDto
{
    [Required, MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Alergias { get; set; }

    public bool NecesitaBus { get; set; }

    public bool NecesitaAlojamiento { get; set; }

    [MaxLength(100)]
    public string? TipoAlojamiento { get; set; }

    public List<AcompananteDto> Acompanantes { get; set; } = [];
}

public class AcompananteDto
{
    [Required, MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;

    /// <summary>"Adulto" | "Nino" | "Bebe"</summary>
    public string Tipo { get; set; } = "Adulto";

    [MaxLength(500)]
    public string? Alergias { get; set; }
}

// DTO para votar regalo: POST /api/regalos/votar
public class VotoRegaloDto
{
    [Required]
    public List<string> Opciones { get; set; } = [];

    [MaxLength(200)]
    public string NombreInvitado { get; set; } = string.Empty;
}
