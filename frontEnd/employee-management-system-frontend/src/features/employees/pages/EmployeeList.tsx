import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../api/axiosInstance';
import { employeeApi, type Employee } from '../../../api/employeeApi';
import { reportsApi } from '../../../api/reportsApi';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

export default function EmployeeList() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        id: 0,
        employeeName: ''
    });
    const [isDownloading, setIsDownloading] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            console.log('Fetching employees from:', `${API_BASE_URL}/Employee`);
            const data = await employeeApi.getAllEmployees();
            console.log('Employees loaded successfully:', data);
            setEmployees(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            console.error('Error loading employees:', err);
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.message 
                    || err.response?.data?.title 
                    || err.message;
                console.log('Server error details:', {
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data
                });
                setError(`Failed to load employees: ${errorMessage}`);
            } else {
                setError('Failed to load employees. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/employees/edit/${id}`);
    };

    const handleDelete = (id: number, name: string) => {
        setDeleteDialog({
            open: true,
            id,
            employeeName: name
        });
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            await employeeApi.deleteEmployee(deleteDialog.id);
            await loadEmployees(); // Reload the list after deletion
            setDeleteDialog({ open: false, id: 0, employeeName: '' });
        } catch (err) {
            setError('Failed to delete employee');
            console.error('Error deleting employee:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        try {
            setIsDownloading(true);
            const blob = await reportsApi.downloadReport();
            
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            
            // Set the filename for the download
            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = `employee-report-${currentDate}.pdf`;
            link.setAttribute('download', fileName);
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the URL
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading report:', err);
            setError('Failed to download report. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="card shadow">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="h5 mb-0">
                            Employee Directory
                        </h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/employees/create')}
                        >
                            Add Employee
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger mb-4">
                            {error}
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Email</th>
                                    <th className="text-end">Salary</th>
                                    <th>Date Joined</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>
                                            {`${employee.firstName} ${employee.lastName}`}
                                        </td>
                                        <td>{employee.department}</td>
                                        <td>{employee.position}</td>
                                        <td>{employee.email}</td>
                                        <td className="text-end">
                                            ${employee.salary.toLocaleString()}
                                        </td>
                                        <td>
                                            {new Date(employee.dateOfJoining).toLocaleDateString()}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEdit(employee.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(
                                                    employee.id,
                                                    `${employee.firstName} ${employee.lastName}`
                                                )}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 p-3 border-top d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={handleDownloadReport}
                            disabled={isDownloading}
                        >
                            {isDownloading ? 'Downloading...' : 'Download Report'}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={deleteDialog.open}
                title="Confirm Delete"
                message={`Are you sure you want to delete ${deleteDialog.employeeName}?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog({ open: false, id: 0, employeeName: '' })}
            />
        </div>
    );
}