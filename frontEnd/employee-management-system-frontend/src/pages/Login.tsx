import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../features/auth/pages/LoginPage.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect to employees page if already authenticated
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token && isAuthenticated) {
            navigate('/employees', { replace: true });
        }
    }, []); // Only check on component mount

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // First, check if the backend server is running
            try {
                await fetch('http://localhost:5003/api/health', { method: 'GET' });
            } catch (healthError) {
                throw new Error('Backend server is not running. Please start the server and try again.');
            }

            const response = await axiosInstance.post('/auth/login', {
                username,
                password
            });

            const data = response.data;
            console.log('Response data:', data); // For debugging

            // Handle different API response structures
            const token = data.token || data.access_token;
            const user = data.user || {
                id: data.userId || data.id,
                email: data.email || data.username,
                role: data.role || 'admin' // Assuming admin role if not specified
            };

            if (!token) {
                throw new Error('No token received from server');
            }

            // Safely check the role
            const userRole = user?.role?.toLowerCase();
            if (userRole !== 'admin') {
                throw new Error('Access denied. Admin privileges required.');
            }

            await login(user, token);
            navigate('/employees', { replace: true });
        } catch (err) {
            if (err instanceof Error && err.message) {
                setError(err.message);
            } else {
                setError('Login failed. Please check your credentials.');
            }
            setPassword('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="snow-layer"></div>
            <div className="login-box">
                <h1>Admin Login</h1>
                <form onSubmit={handleSubmit} className={isLoading ? 'loading' : ''}>
                    {error && <div className="error-message">
                        <span role="img" aria-label="error">⚠️</span> {error}
                    </div>}
                    <div className="form-group">
                        <label htmlFor="username" data-icon="👤">Username</label>
                        <input
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            disabled={isLoading}
                            autoFocus
                            required
                            placeholder="Enter your username"
                            className={isLoading ? 'input-disabled' : ''}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" data-icon="🔑">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            disabled={isLoading}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading || !username || !password}
                        className="submit-button"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;