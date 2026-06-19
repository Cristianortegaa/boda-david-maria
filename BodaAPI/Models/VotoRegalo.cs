// BodaAPI/Models/VotoRegalo.cs
using System.ComponentModel.DataAnnotations;

namespace BodaAPI.Models;

public class VotoRegalo
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Opcion { get; set; } = string.Empty;  // Ej: "Viaje de novios", "Lista de Novios Shopify"

    [Required, MaxLength(200)]
    public string NombreInvitado { get; set; } = string.Empty;

    public DateTime FechaVoto { get; set; } = DateTime.UtcNow;
}
