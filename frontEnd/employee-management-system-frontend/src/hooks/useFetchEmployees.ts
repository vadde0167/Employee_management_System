import { useState, useEffect } from 'react';
import type { Employee } from '../api/employeeApi';

export function useFetchEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/employees', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            
            const data = await response.json();
            setEmployees(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching employees');
        } finally {
            setLoading(false);
        }
    };

    const refreshEmployees = () => {
        fetchEmployees();
    };

    return { employees, loading, error, refreshEmployees };
}