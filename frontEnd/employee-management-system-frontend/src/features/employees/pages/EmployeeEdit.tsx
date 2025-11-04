import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema } from '../validation/employeeSchema';
import { employeeApi, type Employee } from '../../../api/employeeApi';

type EmployeeFormData = Omit<Employee, 'id'>;

export default function EmployeeEdit() {
    const { id } = useParams<{ id: string }>();
    const [employeeId, setEmployeeId] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema)
    });

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                console.log(`Fetching employee with database ID: ${id}`);
                const fetchedEmployee = await employeeApi.getEmployeeById(Number(id));
                console.log('Fetched employee data:', fetchedEmployee);
                
                setEmployeeId(fetchedEmployee.id);
                reset({
                    firstName: fetchedEmployee.firstName,
                    lastName: fetchedEmployee.lastName,
                    email: fetchedEmployee.email,
                    department: fetchedEmployee.department,
                    position: fetchedEmployee.position,
                    salary: fetchedEmployee.salary,
                    dateOfJoining: fetchedEmployee.dateOfJoining.split('T')[0]
                });
            } catch (err) {
                console.error('Error fetching employee:', err);
                if (axios.isAxiosError(err)) {
                    setError(
                        err.response?.data?.message || 
                        err.response?.data?.title ||
                        err.message || 
                        'Failed to fetch employee'
                    );
                } else {
                    setError(err instanceof Error ? err.message : 'Failed to fetch employee');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployee();
    }, [id, reset]);

    const onSubmit = async (data: EmployeeFormData) => {
        try {
            setError('');
            setIsSubmitting(true);
            
            // Log the raw form data
            console.log('Raw form data:', data);
            
            if (employeeId === null) {
                throw new Error('Employee ID is missing');
            }

            // Ensure all required fields are filled and properly formatted
            const updateData: EmployeeFormData = {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email: data.email.trim(),
                department: data.department.trim(),
                position: data.position.trim(),
                salary: Number(data.salary),
                dateOfJoining: data.dateOfJoining
            };

            // Log the processed data being sent
            console.log('Processed data to send:', {
                id: employeeId,
                ...updateData
            });
            
            await employeeApi.updateEmployee(employeeId, updateData);
            console.log('Employee updated successfully');
            navigate('/employees');
        } catch (err) {
            console.error('Error in updateEmployee:', err);
            if (axios.isAxiosError(err)) {
                // Log the complete error response
                console.error('Full axios error:', {
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data,
                    errors: err.response?.data?.errors,
                    message: err.response?.data?.message,
                    title: err.response?.data?.title
                });

                // Handle validation errors specifically
                if (err.response?.data?.errors) {
                    const validationErrors = err.response.data.errors;
                    console.log('Validation errors:', validationErrors);
                    // Convert validation errors object to readable message
                    const errorMessage = Object.entries(validationErrors)
                        .map(([field, errors]) => `${field}: ${errors}`)
                        .join('\n');
                    setError(`Validation Errors:\n${errorMessage}`);
                } else {
                    setError(
                        err.response?.data?.message || 
                        err.response?.data?.title ||
                        'Failed to update employee'
                    );
                }
            } else {
                setError(err instanceof Error ? err.message : 'Failed to update employee');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                    ))}
                    <div className="mt-3 d-flex gap-2">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setError('')}
                        >
                            Try Again
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/employees')}
                        >
                            Back to Employees
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="h5 mb-4">
                        Edit Employee
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                        {...register('firstName')}
                                    />
                                    {errors.firstName && (
                                        <div className="invalid-feedback">
                                            {errors.firstName.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                        {...register('lastName')}
                                    />
                                    {errors.lastName && (
                                        <div className="invalid-feedback">
                                            {errors.lastName.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label>Department</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                                        {...register('department')}
                                    />
                                    {errors.department && (
                                        <div className="invalid-feedback">
                                            {errors.department.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label>Position</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.position ? 'is-invalid' : ''}`}
                                        {...register('position')}
                                    />
                                    {errors.position && (
                                        <div className="invalid-feedback">
                                            {errors.position.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label>Salary</label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                                        {...register('salary', { valueAsNumber: true })}
                                    />
                                    {errors.salary && (
                                        <div className="invalid-feedback">
                                            {errors.salary.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label>Date of Joining</label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.dateOfJoining ? 'is-invalid' : ''}`}
                                        {...register('dateOfJoining')}
                                    />
                                    {errors.dateOfJoining && (
                                        <div className="invalid-feedback">
                                            {errors.dateOfJoining.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={() => navigate('/employees')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}