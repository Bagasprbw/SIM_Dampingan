import { Routes, Route, Navigate } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import DataAdminPage from '../pages/DataAdminPage';
import DataFasilitatorPage from '../pages/DataFasilitatorPage';
import DataPjPage from '../pages/DataPjPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Guest Routes */}
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/data-admin" element={<DataAdminPage />} />
                <Route path="/data-fasilitator" element={<DataFasilitatorPage />} />
                <Route path="/data-pj" element={<DataPjPage />} />
                {/* Tambahkan route superadmin di sini nanti */}
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

