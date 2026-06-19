// BodaAPI/Services/ExcelExportService.cs
using BodaAPI.Models;
using ClosedXML.Excel;

namespace BodaAPI.Services;

public class ExcelExportService(ILogger<ExcelExportService> logger) : IExcelExportService
{
    // No-op: el Excel se genera bajo demanda en GET /api/invitados/export
    public Task ActualizarExcelInvitadosAsync(Invitado invitado) => Task.CompletedTask;

    public byte[] GenerarExcel(IList<Invitado> invitados)
    {
        using var wb = new XLWorkbook();

        // ── Hoja 1: Resumen ───────────────────────────────────────────────────
        var ws = wb.Worksheets.Add("Invitados");

        // Cabeceras
        string[] headers = ["#", "Nombre", "Acompañantes", "Total personas",
                             "Alergias", "Necesita bus", "Necesita alojamiento",
                             "Tipo alojamiento", "Fecha registro"];
        for (int i = 0; i < headers.Length; i++)
        {
            var cell = ws.Cell(1, i + 1);
            cell.Value = headers[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#6A6B4B");
            cell.Style.Font.FontColor = XLColor.White;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }

        // Filas de datos
        int row = 2;
        int num = 1;
        foreach (var inv in invitados)
        {
            int totalPersonas = 1 + inv.Acompanantes.Count;
            string acompNombres = inv.Acompanantes.Count > 0
                ? string.Join(", ", inv.Acompanantes.Select(a => a.Nombre))
                : "—";

            ws.Cell(row, 1).Value = num++;
            ws.Cell(row, 2).Value = inv.Nombre;
            ws.Cell(row, 3).Value = acompNombres;
            ws.Cell(row, 4).Value = totalPersonas;
            ws.Cell(row, 5).Value = inv.Alergias ?? "—";
            ws.Cell(row, 6).Value = inv.NecesitaBus ? "Sí" : "No";
            ws.Cell(row, 7).Value = inv.NecesitaAlojamiento ? "Sí" : "No";
            ws.Cell(row, 8).Value = inv.TipoAlojamiento ?? "—";
            ws.Cell(row, 9).Value = inv.FechaRegistro.ToLocalTime().ToString("dd/MM/yyyy HH:mm");

            // Fila alternada
            if (row % 2 == 0)
            {
                ws.Row(row).Cells(1, 9)
                    .Style.Fill.BackgroundColor = XLColor.FromHtml("#F5F5F5");
            }

            row++;
        }

        // Totales
        if (invitados.Count > 0)
        {
            var totalRow = row + 1;
            ws.Cell(totalRow, 1).Value = "TOTAL";
            ws.Cell(totalRow, 1).Style.Font.Bold = true;
            ws.Cell(totalRow, 4).Value = invitados.Sum(i => 1 + i.Acompanantes.Count);
            ws.Cell(totalRow, 4).Style.Font.Bold = true;
        }

        // Ajustar ancho columnas
        ws.Columns().AdjustToContents();
        ws.Column(3).Width = Math.Min(ws.Column(3).Width, 40); // acompañantes no muy ancho

        // Congelar primera fila
        ws.SheetView.FreezeRows(1);

        // ── Hoja 2: Acompañantes ─────────────────────────────────────────────
        var ws2 = wb.Worksheets.Add("Acompañantes");
        string[] headers2 = ["Invitado principal", "Nombre acompañante", "Tipo", "Alergias"];
        for (int i = 0; i < headers2.Length; i++)
        {
            var cell = ws2.Cell(1, i + 1);
            cell.Value = headers2[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#6A6B4B");
            cell.Style.Font.FontColor = XLColor.White;
        }

        int row2 = 2;
        foreach (var inv in invitados)
        {
            foreach (var a in inv.Acompanantes)
            {
                ws2.Cell(row2, 1).Value = inv.Nombre;
                ws2.Cell(row2, 2).Value = a.Nombre;
                ws2.Cell(row2, 3).Value = a.Tipo.ToString();
                ws2.Cell(row2, 4).Value = a.Alergias ?? "—";
                row2++;
            }
        }
        ws2.Columns().AdjustToContents();
        ws2.SheetView.FreezeRows(1);

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        logger.LogInformation("Excel generado con {N} invitados", invitados.Count);
        return ms.ToArray();
    }
}
