// BodaAPI/Services/MockEmailService.cs
namespace BodaAPI.Services;

public class MockEmailService(ILogger<MockEmailService> logger) : IEmailService
{
    public Task EnviarConfirmacionInvitadoAsync(string nombreInvitado, string emailDestino)
    {
        logger.LogInformation("[EMAIL] Confirmación enviada a {Email} para el invitado {Nombre}", emailDestino, nombreInvitado);
        return Task.CompletedTask;
    }

    public Task EnviarNotificacionAdminAsync(string nombreInvitado)
    {
        logger.LogInformation("[EMAIL] Notificación admin: nuevo invitado registrado → {Nombre}", nombreInvitado);
        return Task.CompletedTask;
    }
}
