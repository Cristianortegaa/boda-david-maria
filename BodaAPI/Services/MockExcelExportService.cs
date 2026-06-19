// BodaAPI/Services/MockExcelExportService.cs
using BodaAPI.Models;

namespace BodaAPI.Services;

public class MockExcelExportService(ILogger<MockExcelExportService> logger) : IExcelExportService
{
    public Task ActualizarExcelInvitadosAsync(Invitado invitado)
    {
        logger.LogInformation("[EXCEL] Mock: registro para {Nombre}", invitado.Nombre);
        return Task.CompletedTask;
    }

    public byte[] GenerarExcel(IList<Invitado> invitados)
    {
        logger.LogInformation("[EXCEL] Mock: GenerarExcel llamado con {N} invitados", invitados.Count);
        return Array.Empty<byte>();
    }
}
