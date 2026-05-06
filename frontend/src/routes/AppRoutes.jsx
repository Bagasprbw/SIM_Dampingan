import { Routes, Route, Navigate } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import RouteGuard from '../guards/RouteGuard';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import DataAdminPage from '../pages/DataAdmin/DataAdminPage';
import DataFasilitatorPage from '../pages/DataFasilitator/DataFasilitatorPage';
import DataPjPage from '../pages/DataPjDampingan/DataPjPage';
import DataGrupPage from '../pages/DataGrupDampingan/DataGrupPage';
import DataDampinganPage from '../pages/DataDampingan/DataDampinganPage';
import KegiatanDampinganPage from '../pages/KegiatanDampingan/KegiatanDampinganPage';
import KelolaKegiatanPage from '../pages/KelolaKegiatan/KelolaKegiatanPage';
import EditKegiatanPage from '../pages/KelolaKegiatan/EditKegiatanPage';
import KelolaHakAksesPage from '../pages/KelolaHakAkses/KelolaHakAksesPage';
import PetaSebaranPage from '../pages/PetaSebaran/PetaSebaranPage';
import LogAktifitasPage from '../pages/LogAktivitas/LogAktifitasPage';
import PanduanPenggunaanPage from '../pages/Panduan/PanduanPenggunaanPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Guest Routes */}
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Protected Routes dengan RouteGuard */}
            <Route element={<RouteGuard />}>
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
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;

