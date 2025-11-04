import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema } from '../validation/employeeSchema';
import { employeeApi, type Employee } from '../../../api/employeeApi';

type EmployeeFormData = Omit<Employee, 'id'>;

export default function EmployeeCreate() {
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            department: '',
            position: '',
            salary: 0,
            dateOfJoining: new Date().toISOString().split('T')[0]
        }
    });

    const onSubmit = async (data: EmployeeFormData) => {
        try {
            setError('');
            setIsSubmitting(true);
            console.log('Submitting employee data:', data);
            await employeeApi.createEmployee(data);
            console.log('Employee created successfully');
            navigate('/employees');
        } catch (err) {
            console.error('Error in createEmployee:', err);
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message || 
                    err.response?.data?.title ||
                    err.message || 
                    'Failed to create employee'
                );
            } else {
                setError(err instanceof Error ? err.message : 'Failed to create employee');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="h5 mb-4">Create New Employee</h2>

                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

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
                                {isSubmitting ? 'Creating...' : 'Create Employee'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}