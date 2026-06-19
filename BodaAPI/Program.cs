// BodaAPI/Program.cs
using BodaAPI.Data;
using BodaAPI.Services;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// ── CORS ──────────────────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:4200"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ── Base de datos PostgreSQL ──────────────────────────────────────────────────
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Servicios propios ─────────────────────────────────────────────────────────
builder.Services.AddHttpClient();  // necesario para ResendEmailService
builder.Services.AddScoped<IEmailService, ResendEmailService>();
builder.Services.AddScoped<IExcelExportService, ExcelExportService>();

// ── Controllers + OpenAPI ─────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// ── Migraciones automáticas (dev: crea la BD; prod: aplica migraciones) ──────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    if (app.Environment.IsDevelopment())
        EnsureDatabase(builder.Configuration.GetConnectionString("DefaultConnection")!);
    await db.Database.MigrateAsync();   // crea tablas si no existen (idempotente)
}

// ── Pipeline ──────────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors("Angular");
// HTTPS solo en desarrollo; en Railway/Render el proxy ya lo gestiona
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

// ── Helper: crea la BD si no existe (usa template1 como mantenimiento) ────────
static void EnsureDatabase(string connectionString)
{
    var csb = new NpgsqlConnectionStringBuilder(connectionString);
    var targetDb = csb.Database;
    csb.Database = "template1";   // BD de mantenimiento que siempre existe

    try
    {
        using var conn = new NpgsqlConnection(csb.ToString());
        conn.Open();

        using var checkCmd = conn.CreateCommand();
        checkCmd.CommandText = $"SELECT 1 FROM pg_database WHERE datname = @db";
        checkCmd.Parameters.AddWithValue("db", targetDb!);
        var exists = checkCmd.ExecuteScalar() is not null;

        if (!exists)
        {
            // CreateDatabase no admite parámetros, el nombre ya viene del config
            using var createCmd = conn.CreateCommand();
            createCmd.CommandText = $"CREATE DATABASE \"{targetDb}\"";
            createCmd.ExecuteNonQuery();
            Console.WriteLine($"[DB] Base de datos '{targetDb}' creada.");
        }
        else
        {
            Console.WriteLine($"[DB] La base de datos '{targetDb}' ya existe.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB] No se pudo crear la base de datos: {ex.Message}");
        Console.WriteLine("[DB] Créala manualmente en pgAdmin y vuelve a arrancar.");
    }
}
