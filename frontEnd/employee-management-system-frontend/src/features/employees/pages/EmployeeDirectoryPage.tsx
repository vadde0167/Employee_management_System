import { useState } from 'react';
import { useFetchEmployees } from '../../../hooks/useFetchEmployees';
import './EmployeeDirectoryPage.css';

export default function EmployeeDirectoryPage() {
    const { employees, loading, error, refreshEmployees } = useFetchEmployees();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading employees...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={refreshEmployees} className="retry-button">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const displayedEmployees = employees.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const totalPages = Math.ceil(employees.length / rowsPerPage);

    return (
        <div className="employee-directory">
            <h1>Employee Directory</h1>
            
            <div className="table-container">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Email</th>
                            <th>Salary</th>
                            <th>Date of Joining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedEmployees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{`${employee.firstName} ${employee.lastName}`}</td>
                                <td>{employee.department}</td>
                                <td>{employee.position}</td>
                                <td>{employee.email}</td>
                                <td>${employee.salary.toLocaleString()}</td>
                                <td>{new Date(employee.dateOfJoining).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <div className="pagination-controls">
                    <button
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 0}
                        className="page-button"
                    >
                        Previous
                    </button>
                    
                    <span className="page-info">
                        Page {page + 1} of {totalPages}
                    </span>
                    
                    <button
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= totalPages - 1}
                        className="page-button"
                    >
                        Next
                    </button>
                </div>
                
                <div className="rows-per-page">
                    <label htmlFor="rowsPerPage">Rows per page:</label>
                    <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        className="rows-select"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                    </select>
                </div>
            </div>
        </div>
    );
}