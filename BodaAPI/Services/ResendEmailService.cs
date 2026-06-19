// BodaAPI/Services/ResendEmailService.cs
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace BodaAPI.Services;

public class ResendEmailService(
    IHttpClientFactory httpFactory,
    IConfiguration config,
    ILogger<ResendEmailService> logger) : IEmailService
{
    // EnviarConfirmacionInvitadoAsync: el controller llama aquí con el email de los novios.
    // Enviamos una notificación detallada al email configurado en Resend:AdminEmail.
    public async Task EnviarConfirmacionInvitadoAsync(string nombreInvitado, string _)
    {
        var adminEmail = config["Resend:AdminEmail"]
            ?? throw new InvalidOperationException("Falta Resend:AdminEmail en la configuración.");

        var html = "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'>" +
            "<style>" +
            "body{font-family:Georgia,serif;background:#FDFBFA;margin:0;padding:0}" +
            ".wrap{max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)}" +
            ".hdr{background:#6A6B4B;padding:28px 32px;text-align:center}" +
            ".hdr h1{color:#fff;margin:0;font-size:22px;font-weight:normal}" +
            ".bdy{padding:32px;color:#333;line-height:1.6}" +
            ".name{font-size:26px;color:#6A6B4B;font-weight:bold;margin:0 0 8px}" +
            ".ftr{background:#F5F5F5;padding:16px 32px;font-size:12px;color:#999;text-align:center}" +
            "</style></head><body>" +
            "<div class='wrap'>" +
            "<div class='hdr'><h1>Boda de Maria y David</h1></div>" +
            "<div class='bdy'>" +
            "<p>Nueva confirmacion de asistencia:</p>" +
            $"<p class='name'>{nombreInvitado}</p>" +
            "<p>Ha completado el formulario y quedara registrado/a en vuestra lista de invitados.</p>" +
            "</div>" +
            "<div class='ftr'>Correo generado automaticamente por la app de la boda.</div>" +
            "</div></body></html>";

        await SendAsync(adminEmail, $"✅ {nombreInvitado} ha confirmado su asistencia", html);
    }

    // No enviamos un segundo correo para no duplicar. El de arriba ya notifica a los novios.
    public Task EnviarNotificacionAdminAsync(string nombreInvitado) => Task.CompletedTask;

    // ── Método interno ────────────────────────────────────────────────────────
    private async Task SendAsync(string to, string subject, string html)
    {
        var apiKey = config["Resend:ApiKey"]
            ?? throw new InvalidOperationException("Falta Resend:ApiKey en la configuración.");
        // onboarding@resend.dev es el dominio de prueba de Resend (ya verificado, sin configuración extra)
        const string from = "Boda Maria y David <onboarding@resend.dev>";

        logger.LogInformation("Enviando email via Resend a {To}", to);
        var payload = new
        {
            from,
            to = new[] { to },
            subject,
            html
        };

        var json = JsonSerializer.Serialize(payload);
        var client = httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails")
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

        try
        {
            var response = await client.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
                logger.LogError("Resend error {Status}: {Body}", (int)response.StatusCode, body);
            else
                logger.LogInformation("Email enviado a {To}: {Subject}", to, subject);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al enviar email con Resend");
        }
    }
}
