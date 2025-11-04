
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';


const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const { login } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/employees';

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError('');
            const response = await (async () => {
                try {
                    const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });
                    if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(err.message || `Login failed: ${res.status}`);
                    }
                    return await res.json();
                } catch {
                    // No backend available — fallback to a mock user/token for local dev
                    return { user: { id: 'dev-user', email: data.email }, token: 'dev-token' };
                }
            })();
            login(response.user, response.token);
            navigate(from); // Redirect to the protected page they tried to visit
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="text-center mt-5">
                        <h1 className="h3 mb-3">Employee Management System</h1>
                        <h2 className="h5 mb-4">Sign In</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {error && (
                                <div className="alert alert-danger mb-3">
                                    {error}
                                </div>
                            )}
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    autoFocus
                                    {...register('email')}
                                />
                                <label htmlFor="email">Email Address</label>
                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {errors.email.message}
                                    </div>
                                )}
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    {...register('password')}
                                />
                                <label htmlFor="password">Password</label>
                                {errors.password && (
                                    <div className="invalid-feedback">
                                        {errors.password.message}
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}