import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/storage';

/**
 * Protects routes — redirects to /login if not authenticated.
 */
const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
