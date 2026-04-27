import { Routes, Route, Navigate } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import DataAdminPage from '../pages/DataAdminPage';
import DataFasilitatorPage from '../pages/DataFasilitatorPage';
import DataPjPage from '../pages/DataPjPage';
import DataGrupPage from '../pages/DataGrupPage';
import DataDampinganPage from '../pages/DataDampinganPage';
import KegiatanDampinganPage from '../pages/KegiatanDampinganPage';
import KelolaKegiatanPage from '../pages/KelolaKegiatanPage';
import EditKegiatanPage from '../pages/EditKegiatanPage';
import KelolaHakAksesPage from '../pages/KelolaHakAksesPage';
import PetaSebaranPage from '../pages/PetaSebaranPage';
import LogAktifitasPage from '../pages/LogAktifitasPage';
import PanduanPenggunaanPage from '../pages/PanduanPenggunaanPage';

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
                <Route path="/data-grup" element={<DataGrupPage />} />
                <Route path="/data-dampingan" element={<DataDampinganPage />} />
                <Route path="/kegiatan-dampingan" element={<KegiatanDampinganPage />} />
                <Route path="/kelola-kegiatan" element={<KelolaKegiatanPage />} />
                <Route path="/kelola-kegiatan/edit/:id" element={<EditKegiatanPage />} />
                <Route path="/hak-akses" element={<KelolaHakAksesPage />} />
                <Route path="/peta" element={<PetaSebaranPage />} />
                <Route path="/log" element={<LogAktifitasPage />} />
                <Route path="/panduan" element={<PanduanPenggunaanPage />} />
                {/* Tambahkan route superadmin di sini nanti */}
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

