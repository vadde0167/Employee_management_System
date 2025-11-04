import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Employee } from '../../../api/employeeApi';
import './EmployeeForm.css';

const employeeSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    department: z.string().min(1, 'Department is required'),
    position: z.string().min(1, 'Position is required'),
    salary: z.number().min(0, 'Salary must be a positive number'),
    dateOfJoining: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
    employee?: Employee;
    onSubmit: (data: EmployeeFormData) => Promise<void>;
    onCancel: () => void;
}

export default function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: employee ? {
            ...employee,
            dateOfJoining: employee.dateOfJoining.split('T')[0] // Format date for input
        } : {
            firstName: '',
            lastName: '',
            email: '',
            department: '',
            position: '',
            salary: 0,
            dateOfJoining: new Date().toISOString().split('T')[0]
        }
    });

    const handleFormSubmit = async (data: EmployeeFormData) => {
        try {
            setError('');
            setIsSubmitting(true);
            await onSubmit(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="employee-form-container">
            <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit(handleFormSubmit)} className="employee-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            {...register('firstName')}
                            className={errors.firstName ? 'error' : ''}
                        />
                        {errors.firstName && (
                            <span className="error-text">{errors.firstName.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            {...register('lastName')}
                            className={errors.lastName ? 'error' : ''}
                        />
                        {errors.lastName && (
                            <span className="error-text">{errors.lastName.message}</span>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && (
                        <span className="error-text">{errors.email.message}</span>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <input
                            id="department"
                            type="text"
                            {...register('department')}
                            className={errors.department ? 'error' : ''}
                        />
                        {errors.department && (
                            <span className="error-text">{errors.department.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="position">Position</label>
                        <input
                            id="position"
                            type="text"
                            {...register('position')}
                            className={errors.position ? 'error' : ''}
                        />
                        {errors.position && (
                            <span className="error-text">{errors.position.message}</span>
                        )}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="salary">Salary</label>
                        <input
                            id="salary"
                            type="number"
                            {...register('salary', { valueAsNumber: true })}
                            className={errors.salary ? 'error' : ''}
                        />
                        {errors.salary && (
                            <span className="error-text">{errors.salary.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="dateOfJoining">Date of Joining</label>
                        <input
                            id="dateOfJoining"
                            type="date"
                            {...register('dateOfJoining')}
                            className={errors.dateOfJoining ? 'error' : ''}
                        />
                        {errors.dateOfJoining && (
                            <span className="error-text">{errors.dateOfJoining.message}</span>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="submit-button"
                    >
                        {isSubmitting ? 'Saving...' : (employee ? 'Update' : 'Create')}
                    </button>
                </div>
            </form>
        </div>
    );
}