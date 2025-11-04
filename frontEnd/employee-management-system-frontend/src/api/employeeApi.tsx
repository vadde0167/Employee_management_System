import axios from 'axios';
import axiosInstance, { API_BASE_URL } from './axiosInstance';

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    department: string;
    position: string;
    salary: number;
    dateOfJoining: string;
    email: string;
}

export interface EmployeeCreate {
    firstName: string;
    lastName: string;
    department: string;
    position: string;
    salary: number;
    dateOfJoining: string;
    email: string;
}

export const employeeApi = {
    // Get all employees
    getAllEmployees: async (): Promise<Employee[]> => {
        try {
            console.log('Attempting to fetch employees from:', `${API_BASE_URL}/Employees`);
            const response = await axiosInstance.get<Employee[]>('/Employees');
            console.log('getAllEmployees response:', response.data);
            if (!Array.isArray(response.data)) {
                console.warn('Expected array response but got:', typeof response.data);
                return [];
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            if (axios.isAxiosError(error)) {
                console.error('Network or server error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
            }
            throw error;
        }
    },

    // Get employee by ID
    getEmployeeById: async (id: number): Promise<Employee> => {
        try {
            const response = await axiosInstance.get<Employee>(`/Employees/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching employee ${id}:`, error);
            throw error;
        }
    },

    // Helper function to format employee data
    formatEmployeeData: (data: Omit<Employee, 'id'>) => {
        // Ensure salary is a valid decimal number for PostgreSQL
        let salary: number;
        if (typeof data.salary === 'string') {
            salary = Number(parseFloat(data.salary).toFixed(2));
        } else {
            salary = Number(data.salary.toFixed(2));
        }

        // Validate salary
        if (isNaN(salary) || salary < 0) {
            throw new Error('Salary must be a valid positive number');
        }

        // Format date for PostgreSQL (YYYY-MM-DD)
        let dateStr: string;
        if (data.dateOfJoining) {
            const date = new Date(data.dateOfJoining);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date format. Use YYYY-MM-DD');
            }
            dateStr = date.toISOString().split('T')[0];
        } else {
            dateStr = new Date().toISOString().split('T')[0];
        }
        
        const formatted = {
            firstName: String(data.firstName || '').trim(),
            lastName: String(data.lastName || '').trim(),
            email: String(data.email || '').trim().toLowerCase(),
            department: String(data.department || '').trim(),
            position: String(data.position || '').trim(),
            salary: salary,
            dateOfJoining: dateStr
        };

        console.log('Data transformation:', {
            original: data,
            formatted: formatted,
            salary: {
                original: data.salary,
                type: typeof data.salary,
                formatted: salary
            },
            date: {
                original: data.dateOfJoining,
                formatted: dateStr
            }
        });

        return formatted;
    },

    // Create new employee
    createEmployee: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
        try {
            console.log('Create - Original data:', employee);
            const formattedData = employeeApi.formatEmployeeData(employee);
            
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position', 'salary', 'dateOfJoining'];
            const missingFields = requiredFields.filter(field => !formattedData[field as keyof typeof formattedData]);
            if (missingFields.length > 0) {
                throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
            }

            console.log('Create - Sending data:', {
                url: '/Employees',
                payload: formattedData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const response = await axiosInstance.post<Employee>('/Employees', formattedData);
            console.log('Create - Response:', {
                status: response.status,
                data: response.data
            });
            return response.data;
        } catch (error) {
            console.error('Create - Error occurred:', error);
            if (axios.isAxiosError(error)) {
                // Log the full error details
                console.error('Server Error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    errors: error.response?.data?.errors || error.response?.data?.Errors
                });

                // Handle .NET 8 validation response format
                const validationErrors = error.response?.data?.errors || error.response?.data?.Errors;
                if (validationErrors) {
                    const errorMessages = Object.entries(validationErrors)
                        .map(([field, messages]) => {
                            const msgArray = Array.isArray(messages) ? messages : [messages];
                            return `${field}: ${msgArray.join(', ')}`;
                        })
                        .join('\n');
                    throw new Error(`Validation errors:\n${errorMessages}`);
                }

                throw new Error(error.response?.data?.title || 'Failed to create employee');
            }
            throw error;
        }
    },

    // Update employee
    updateEmployee: async (id: number, employee: Omit<Employee, 'id'>): Promise<Employee> => {
        try {
            console.log('Update - Original data:', { 
                id,
                ...employee 
            });
            const formattedData = employeeApi.formatEmployeeData(employee);
            
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position', 'salary', 'dateOfJoining'];
            const missingFields = requiredFields.filter(field => !formattedData[field as keyof typeof formattedData]);
            if (missingFields.length > 0) {
                throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
            }

            // Include the ID in the request body
            const updatePayload = {
                id,
                ...formattedData
            };

            console.log('Update - Sending data:', {
                url: `/Employees/${id}`,
                payload: updatePayload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const response = await axiosInstance.put<Employee>(`/Employees/${id}`, updatePayload);
            console.log('Update - Response:', {
                status: response.status,
                data: response.data
            });
            return response.data;
        } catch (error) {
            console.error('Update - Error occurred:', error);
            if (axios.isAxiosError(error)) {
                // Log the full error details
                console.error('Server Error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    errors: error.response?.data?.errors || error.response?.data?.Errors
                });

                // Handle .NET 8 validation response format
                const validationErrors = error.response?.data?.errors || error.response?.data?.Errors;
                if (validationErrors) {
                    const errorMessages = Object.entries(validationErrors)
                        .map(([field, messages]) => {
                            const msgArray = Array.isArray(messages) ? messages : [messages];
                            return `${field}: ${msgArray.join(', ')}`;
                        })
                        .join('\n');
                    throw new Error(`Validation errors:\n${errorMessages}`);
                }

                throw new Error(error.response?.data?.title || 'Failed to update employee');
            }
            throw error;
        }
    },

    // Delete employee
    deleteEmployee: async (id: number): Promise<void> => {
        try {
            await axiosInstance.delete(`/Employees/${id}`);
            console.log(`Successfully deleted employee ${id}`);
        } catch (error) {
            console.error(`Error deleting employee ${id}:`, error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Server response:', error.response.data);
            }
            throw error;
        }
    }
};