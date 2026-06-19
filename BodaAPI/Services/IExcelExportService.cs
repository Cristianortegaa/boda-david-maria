// BodaAPI/Services/IExcelExportService.cs
using BodaAPI.Models;

namespace BodaAPI.Services;

public interface IExcelExportService
{
    /// <summary>No-op en producción. El Excel se genera bajo demanda vía /api/invitados/export.</summary>
    Task ActualizarExcelInvitadosAsync(Invitado invitado);

    /// <summary>Genera el Excel completo con todos los invitados y devuelve los bytes.</summary>
    byte[] GenerarExcel(IList<Invitado> invitados);
}
