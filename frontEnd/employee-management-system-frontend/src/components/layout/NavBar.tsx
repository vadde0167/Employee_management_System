import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavBar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav style={{ 
            padding: '1rem', 
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #dee2e6'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}>
                <div>
                    <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/employees" style={{ marginRight: '1rem' }}>Employees</Link>
                            <Link to="/reports" style={{ marginRight: '1rem' }}>Reports</Link>
                        </>
                    )}
                </div>
                <div>
                    {isAuthenticated ? (
                        <button 
                            onClick={logout}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;