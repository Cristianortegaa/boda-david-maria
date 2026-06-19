// BodaAPI/Services/GmailEmailService.cs
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace BodaAPI.Services;

public class GmailEmailService(
    IConfiguration config,
    ILogger<GmailEmailService> logger) : IEmailService
{
    public async Task EnviarConfirmacionInvitadoAsync(string nombreInvitado, string _)
    {
        var html =
            "<div style='font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px'>" +
            "<div style='background:#6A6B4B;padding:20px;border-radius:12px 12px 0 0;text-align:center'>" +
            "<h2 style='color:#fff;margin:0'>Boda de Maria y David</h2>" +
            "</div>" +
            "<div style='background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px'>" +
            "<p style='font-size:16px'>Nueva confirmacion de asistencia:</p>" +
            $"<p style='font-size:22px;font-weight:bold;color:#6A6B4B'>{nombreInvitado}</p>" +
            "<p style='color:#666'>Ha completado el formulario de confirmacion.</p>" +
            "<p style='color:#666;font-size:13px'>Puedes ver todos los invitados descargando el Excel.</p>" +
            "</div></div>";

        await EnviarAsync($"Nueva confirmacion: {nombreInvitado}", html);
    }

    public Task EnviarNotificacionAdminAsync(string nombreInvitado) => Task.CompletedTask;

    private async Task EnviarAsync(string asunto, string html)
    {
        try
        {
            var gmailUser = config["Gmail:User"]
                ?? throw new InvalidOperationException("Falta Gmail:User en variables de entorno");
            var appPassword = config["Gmail:AppPassword"]
                ?? throw new InvalidOperationException("Falta Gmail:AppPassword en variables de entorno");
            var adminEmail = config["Gmail:AdminEmail"] ?? gmailUser;

            logger.LogInformation("Intentando enviar email a {AdminEmail} desde {GmailUser}", adminEmail, gmailUser);

            var mensaje = new MimeMessage();
            mensaje.From.Add(new MailboxAddress("Boda Maria y David", gmailUser));
            mensaje.To.Add(new MailboxAddress("", adminEmail));
            mensaje.Subject = asunto;
            mensaje.Body = new TextPart("html") { Text = html };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(gmailUser, appPassword);
            await smtp.SendAsync(mensaje);
            await smtp.DisconnectAsync(true);

            logger.LogInformation("✅ Email enviado a {AdminEmail}: {Asunto}", adminEmail, asunto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "❌ Error al enviar email via Gmail: {Mensaje}", ex.Message);
        }
    }
}
