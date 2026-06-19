import { Routes, Route, Navigate } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import RouteGuard from '../guards/RouteGuard';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import GantiPasswordPage from '../pages/auth/GantiPasswordPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import DataAdminPage from '../pages/DataAdmin/DataAdminPage';
import DataFasilitatorPage from '../pages/DataFasilitator/DataFasilitatorPage';
import DataPjPage from '../pages/DataPjDampingan/DataPjPage';
import DataGrupPage from '../pages/DataGrupDampingan/DataGrupPage';
import DataDampinganPage from '../pages/DataDampingan/DataDampinganPage';
import KegiatanDampinganPage from '../pages/KegiatanDampingan/KegiatanDampinganPage';
import KelolaKegiatanPage from '../pages/KelolaKegiatan/KelolaKegiatanPage';
import EditKegiatanPage from '../pages/KelolaKegiatan/EditKegiatanPage';
import TambahKegiatanPage from '../pages/KelolaKegiatan/TambahKegiatanPage';
import KelolaHakAksesPage from '../pages/KelolaHakAkses/KelolaHakAksesPage';
import PetaSebaranPage from '../pages/PetaSebaran/PetaSebaranPage';
import LogAktifitasPage from '../pages/LogAktivitas/LogAktifitasPage';
import PanduanPenggunaanPage from '../pages/Panduan/PanduanPenggunaanPage';

import KelolaAnggotaPage from '../pages/KelolaAnggota/KelolaAnggotaPage';
import TambahAnggotaPage from '../pages/KelolaAnggota/TambahAnggotaPage';
import InformasiDampinganPage from '../pages/InformasiDampingan/InformasiDampinganPage';
import KonfirmasiAnggotaPage from '../pages/KonfirmasiAnggota/KonfirmasiAnggotaPage';
import KelolaDampinganPage from '../pages/KelolaDampingan/KelolaDampinganPage';
import ProfilAnggotaPublicPage from '../pages/Public/ProfilAnggotaPublicPage';
import LandingPage from '../pages/Public/LandingPage';
import ManageTemplateSertifikatPage from '../pages/KelolaKegiatan/ManageTemplateSertifikatPage';
import ManageLandingPage from '../pages/Dashboard/ManageLandingPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Guest Routes */}
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Public Routes */}
            <Route path="/anggota/:id" element={<ProfilAnggotaPublicPage />} />

            {/* Protected Routes dengan RouteGuard */}
            <Route element={<RouteGuard />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/data-admin" element={<DataAdminPage />} />
                <Route path="/data-fasilitator" element={<DataFasilitatorPage />} />
                <Route path="/data-pj" element={<DataPjPage />} />
                <Route path="/data-grup" element={<DataGrupPage />} />
                <Route path="/data-dampingan" element={<DataDampinganPage />} />
                <Route path="/data-dampingan/tambah" element={<TambahAnggotaPage />} />
                <Route path="/kelola-anggota" element={<KelolaAnggotaPage />} />
                <Route path="/kelola-anggota/tambah" element={<TambahAnggotaPage />} />
                <Route path="/informasi-dampingan" element={<InformasiDampinganPage />} />
                <Route path="/konfirmasi-anggota" element={<KonfirmasiAnggotaPage />} />
                <Route path="/kelola-dampingan" element={<KelolaDampinganPage />} />
                <Route path="/kegiatan-dampingan" element={<KegiatanDampinganPage />} />
                <Route path="/kelola-kegiatan" element={<KelolaKegiatanPage />} />
                <Route path="/kelola-kegiatan/tambah" element={<TambahKegiatanPage />} />
                <Route path="/kelola-kegiatan/edit/:id" element={<EditKegiatanPage />} />
                <Route path="/hak-akses" element={<KelolaHakAksesPage />} />
                <Route path="/template-sertifikat" element={<ManageTemplateSertifikatPage />} />
                <Route path="/manage-landing-page" element={<ManageLandingPage />} />
                <Route path="/peta" element={<PetaSebaranPage />} />
                <Route path="/log" element={<LogAktifitasPage />} />
                <Route path="/panduan" element={<PanduanPenggunaanPage />} />
                <Route path="/ganti-password" element={<GantiPasswordPage />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;

