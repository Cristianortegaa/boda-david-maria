// BodaAPI/Services/IEmailService.cs
namespace BodaAPI.Services;

public interface IEmailService
{
    Task EnviarConfirmacionInvitadoAsync(string nombreInvitado, string emailDestino);
    Task EnviarNotificacionAdminAsync(string nombreInvitado);
}
