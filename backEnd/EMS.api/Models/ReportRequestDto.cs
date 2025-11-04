using System;

namespace EMS.api.Models
{
    public record ReportRequestDto
    {
        public DateTime? StartDate { get; init; }
        public DateTime? EndDate { get; init; }
    }
}