using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.IO;
using EMS.api.Models;
using EMS.api.Data;
using Microsoft.EntityFrameworkCore;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Kernel.Font;
using iText.IO.Font.Constants;

namespace EMS.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("download")]
        public async Task<IActionResult> DownloadReportAsync()
        {
            return await GeneratePdfReportAsync();
        }

        private async Task<FileResult> GeneratePdfReportAsync()
        {
            var employees = await _context.Employees.AsNoTracking().ToListAsync();
            
            using var stream = new MemoryStream();
            var writer = new PdfWriter(stream);
            var pdf = new PdfDocument(writer);
            var document = new Document(pdf);

            // Add title
            var titleFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
            document.Add(new Paragraph($"Employees Report - Generated on {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}")
                .SetTextAlignment(TextAlignment.CENTER)
                .SetFontSize(14)
                .SetFont(titleFont));

            // Create table
            var table = new Table(9).UseAllAvailableWidth();

            // Add headers
            string[] headers = { "ID", "First Name", "Last Name", "Email", "Department", 
                               "Position", "Salary", "Date of Joining", "Status" };
            foreach (var header in headers)
            {
                table.AddHeaderCell(new Cell().Add(new Paragraph(header).SetFont(titleFont)));
            }

            // Add data rows
            foreach (var employee in employees)
            {
                table.AddCell(new Cell().Add(new Paragraph(employee.Id.ToString())));
                table.AddCell(new Cell().Add(new Paragraph(employee.FirstName)));
                table.AddCell(new Cell().Add(new Paragraph(employee.LastName)));
                table.AddCell(new Cell().Add(new Paragraph(employee.Email)));
                table.AddCell(new Cell().Add(new Paragraph(employee.Department)));
                table.AddCell(new Cell().Add(new Paragraph(employee.Position)));
                table.AddCell(new Cell().Add(new Paragraph(employee.Salary.ToString("C"))));
                table.AddCell(new Cell().Add(new Paragraph(employee.DateOfJoining.ToString("yyyy-MM-dd"))));
                table.AddCell(new Cell().Add(new Paragraph(employee.Status)));
            }

            document.Add(table);
            document.Close();

            var content = stream.ToArray();
            string fileName = $"Employees_Report_{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";

            return File(
                content,
                "application/pdf",
                fileName
            );
        }


    }
}