import axios from 'axios';
import type { AxiosInstance } from 'axios';

export const API_BASE_URL: string = 'http://localhost:5003/api'; // Updated to port 5003

export const clearAuthToken = () => {
    localStorage.removeItem('jwtToken');
};

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor to attach JWT token and log requests
axiosInstance.interceptors.request.use(
    request => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Making request to:', request.url);
        console.log('Request headers:', request.headers);
        return request;
    },
    error => {
        console.error('Request setup error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
    response => {
        console.log('Response received:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('API Error Details:', {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            error: error.message
        });

        if (error.response) {
            // Check for authentication errors
            if (error.response.status === 401 || error.response.status === 403) {
                clearAuthToken();
                window.location.href = '/login';
                return Promise.reject(new Error('Authentication failed'));
            }
            // Server responded with non-2xx status
            console.error('Server error response:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                errors: error.response.data?.errors,
                validationErrors: error.response.data?.ValidationErrors,
                modelState: error.response.data?.ModelState
            });

            // Try to extract validation errors from various possible formats
            const validationErrors = 
                error.response.data?.errors || 
                error.response.data?.ValidationErrors ||
                error.response.data?.ModelState;

            if (validationErrors && typeof validationErrors === 'object') {
                const errorMessages = Object.entries(validationErrors)
                    .map(([field, messages]) => {
                        const msgArray = Array.isArray(messages) ? messages : [messages];
                        return `${field}: ${msgArray.join(', ')}`;
                    })
                    .join('\n');
                throw new Error(`Validation errors:\n${errorMessages}`);
            }

            throw new Error(
                error.response.data?.message || 
                error.response.data?.title ||
                `Server error: ${error.response.status} ${error.response.statusText}`
            );
        } else if (error.request) {
            // Request made but no response received
            console.error('No response received:', {
                request: error.request,
                message: 'The server is not responding. Please verify it is running.'
            });
            throw new Error('Unable to reach the server. Please check if it is running.');
        } else {
            // Error in request setup
            console.error('Request setup error:', error.message);
            throw new Error('Failed to make the request: ' + error.message);
        }
    }
);

export interface ApiErrorResponse {
    message: string;
    details?: string;
    status: number;
}

export default axiosInstance;