import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeList from './features/employees/pages/EmployeeList';
import EmployeeCreate from './features/employees/pages/EmployeeCreate';
import EmployeeEdit from './features/employees/pages/EmployeeEdit';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import NavBar from './components/layout/NavBar';
import './App.css';

// Import custom bootstrap SCSS
import './styles/bootstrap-custom.scss';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/create"
            element={
              <ProtectedRoute>
                <EmployeeCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/edit/:id"
            element={
              <ProtectedRoute>
                <EmployeeEdit />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect root to login page if not authenticated, otherwise to employees */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/employees" replace />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all other routes and redirect to login */}
          <Route 
            path="*" 
            element={<Navigate to="/login" replace />} 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
