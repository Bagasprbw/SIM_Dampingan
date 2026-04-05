import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/storage';

const GuestRoute = () => {
    return !isAuthenticated() ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default GuestRoute;
