using EMS.api.Data;
using EMS.api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

namespace EMS.api.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")] 
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        // --- MOCK DATA STORE (REMOVE/REPLACE) ---
        // Replacing ApplicationDbContext with a static list for in-memory operations
        // private static List<Employee> _employees = new List<Employee> { /* ... mock data ... */ };
        // private static int _nextId = 4;
        // -------------------------

        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR: Re-enable Dependency Injection of ApplicationDbContext
        public EmployeesController(ApplicationDbContext context) 
        { 
            _context = context; 
        }

        // ----------------------------------------------------------------------
        // 1. READ (R): Get All Employees (DB Implementation)
        // GET: /api/employees
        // ----------------------------------------------------------------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            var employees = await _context.Employees
                                        .AsNoTracking()
                                        .ToListAsync();
            
            return Ok(employees);
        }

        // ----------------------------------------------------------------------
        // 2. READ (R): Get Employee By ID (DB Implementation)
        // GET: /api/employees/5
        // ----------------------------------------------------------------------
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            // Find employee by primary key
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound(); // HTTP 404 Not Found
            }

            return Ok(employee); // HTTP 200 OK
        }

        // ----------------------------------------------------------------------
        // 3. CREATE (C): Add a New Employee (DB Implementation)
        // POST: /api/employees
        // ----------------------------------------------------------------------
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            if (employee == null)
            {
                return BadRequest(new { message = "Employee data is required." });
            }

            // Validate required fields
            if (string.IsNullOrEmpty(employee.FirstName) || 
                string.IsNullOrEmpty(employee.LastName) || 
                string.IsNullOrEmpty(employee.Email))
            {
                return BadRequest(new { message = "FirstName, LastName, and Email are required fields." });
            }

            // Add entity to tracking
            _context.Employees.Add(employee);
            
            try
            {
                // Save changes to the PostgreSQL database
                await _context.SaveChangesAsync();
                
                // Returns HTTP 201 Created
                return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { message = "Failed to create employee: " + ex.InnerException?.Message ?? ex.Message });
            }
        }

        // ----------------------------------------------------------------------
        // 4. UPDATE (U): Edit Existing Employee (DB Implementation)
        // PUT: /api/employees/5
        // ----------------------------------------------------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, Employee updatedEmployee)
        {
            if (id != updatedEmployee.Id)
            {
                return BadRequest(new { message = "ID mismatch." }); // HTTP 400
            }

            // Tell EF Core to update this entity
            _context.Entry(updatedEmployee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Employees.Any(e => e.Id == id))
                {
                    return NotFound(); // HTTP 404
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // HTTP 204 No Content
        }

        // ----------------------------------------------------------------------
        // 5. DELETE (D): Remove Employee (DB Implementation)
        // DELETE: /api/employees/5
        // ----------------------------------------------------------------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            
            if (employee == null)
            {
                return NotFound(); // HTTP 404
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent(); // HTTP 204 No Content
        }
    }
}
