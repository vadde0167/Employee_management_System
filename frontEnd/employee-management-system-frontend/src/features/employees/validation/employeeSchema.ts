import { z } from 'zod';

export const employeeSchema = z.object({
    firstName: z.string()
        .min(1, 'First name is required')
        .max(50, 'First name must be less than 50 characters')
        .transform(val => val.trim()),
    lastName: z.string()
        .min(1, 'Last name is required')
        .max(50, 'Last name must be less than 50 characters')
        .transform(val => val.trim()),
    email: z.string()
        .email('Invalid email format')
        .max(100, 'Email must be less than 100 characters')
        .transform(val => val.trim()),
    department: z.string()
        .min(1, 'Department is required')
        .max(50, 'Department must be less than 50 characters')
        .transform(val => val.trim()),
    position: z.string()
        .min(1, 'Position is required')
        .max(50, 'Position must be less than 50 characters')
        .transform(val => val.trim()),
    salary: z.number()
        .min(0, 'Salary must be a positive number')
        .max(1000000, 'Salary must be less than 1,000,000'),
    dateOfJoining: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
        .transform(val => new Date(val + 'T00:00:00.000Z').toISOString())
});