import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/storage';

const GuestRoute = () => {
    const isAuth = isAuthenticated();
    if (!isAuth) return <Outlet />;
    
    const user = getUser();
    if (user?.must_change_password) {
        return <Navigate to="/ganti-password" replace />;
    }
    return <Navigate to="/dashboard" replace />;
};

export default GuestRoute;
