using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.api.Models
{
    // Corresponds to the frontend 'Employee' interface
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Department { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Position { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18, 2)")] // Ensure proper decimal type for currency
        public decimal Salary { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateOfJoining { get; set; } = DateTime.UtcNow;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        // Maps to: 'Active' | 'Inactive' | 'Leave'
        public string Status { get; set; } = "Active";
    }
}
