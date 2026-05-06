import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Users, LayoutGrid, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

// Ambil data grup dampingan dari BE
const useGrupData = () =>
    useQuery({
        queryKey: ['peta', 'grup'],
        queryFn: async () => {
            const res = await api.get('/grup-dampingan');
            return res.data;
        },
    });

// Ambil data anggota aktif dari BE (per_page besar untuk mendapatkan semua data)
const useAnggotaData = () =>
    useQuery({
        queryKey: ['peta', 'anggota'],
        queryFn: async () => {
            const res = await api.get('/anggota-grup', { params: { per_page: 1000, status: 'aktif' } });
            return res.data;
        },
    });

const PetaSebaranPage = () => {
    const [geoData, setGeoData] = useState(null);
    const [geoLoading, setGeoLoading] = useState(true);

    const { data: grupData, isLoading: loadingGrup } = useGrupData();
    const { data: anggotaData, isLoading: loadingAnggota } = useAnggotaData();

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/rifani/geojson-political-indonesia/master/IDN_adm_2_kabkota.json')
            .then(r => r.json())
            .then(d => { setGeoData(d); setGeoLoading(false); })
            .catch(() => setGeoLoading(false));
    }, []);

    // Ambil array dari response (bisa paginated atau langsung array)
    const grupList = useMemo(() => {
        const d = grupData?.data;
        if (!d) return [];
        // Jika paginated: { data: [...], total, ... }
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.data)) return d.data;
        return [];
    }, [grupData]);

    const anggotaList = useMemo(() => {
        const d = anggotaData?.data;
        if (!d) return [];
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.data)) return d.data;
        return [];
    }, [anggotaData]);

    // Agregasi per nama kabupaten
    const statsMap = useMemo(() => {
        const map = {};

        grupList.forEach(g => {
            const kab = g.kabupaten?.name;
            if (!kab) return;
            if (!map[kab]) map[kab] = { grup: 0, anggota: 0 };
            map[kab].grup += 1;
        });

        anggotaList.forEach(a => {
            const kab = a.grupDampingan?.kabupaten?.name;
            if (!kab) return;
            if (!map[kab]) map[kab] = { grup: 0, anggota: 0 };
            map[kab].anggota += 1;
        });

        return map;
    }, [grupList, anggotaList]);

    const totalGrup = grupList.length;
    const totalAnggota = anggotaList.length;

    const getStatsForFeature = (feature) => {
        const kabName = (feature.properties.NAME_2 || feature.properties.KABKOT || '').toLowerCase();
        const key = Object.keys(statsMap).find(k => {
            const kLower = k.toLowerCase();
            return kLower.includes(kabName) || kabName.includes(kLower);
        });
        return key ? statsMap[key] : null;
    };

    const styleFeature = (feature) => {
        const stats = getStatsForFeature(feature);
        const hasData = stats && (stats.grup > 0 || stats.anggota > 0);
        return {
            fillColor: hasData ? '#0080C5' : '#CBD5E1',
            weight: 0.5,
            opacity: 1,
            color: '#bae6fd',
            fillOpacity: hasData ? 0.55 : 0.1,
        };
    };

    const onEachFeature = (feature, layer) => {
        const stats = getStatsForFeature(feature);
        const kabName = feature.properties.NAME_2 || feature.properties.KABKOT || 'Tidak Diketahui';

        layer.bindPopup(`
            <div style="font-family: 'Poppins', sans-serif; min-width: 155px; padding: 4px;">
                <h4 style="margin: 0 0 8px; font-size: 13px; font-weight: 700; color: #0f172a;">${kabName}</h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 11px; color: #64748b;">Anggota Aktif:</span>
                    <span style="font-size: 11px; font-weight: 700; color: #0080C5;">${stats?.anggota ?? 0}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-size: 11px; color: #64748b;">Grup Dampingan:</span>
                    <span style="font-size: 11px; font-weight: 700; color: #00A870;">${stats?.grup ?? 0}</span>
                </div>
                ${!stats ? '<p style="margin: 6px 0 0; font-size:10px; color:#94a3b8; font-style:italic;">Belum ada data</p>' : ''}
            </div>
        `);

        layer.on({
            mouseover: (e) => {
                e.target.setStyle({ fillColor: '#0080C5', weight: 1.5, color: '#fff', fillOpacity: 0.9 });
                e.target.bringToFront();
            },
            mouseout: () => layer.setStyle(styleFeature(feature)),
        });
    };

    const isLoading = geoLoading || loadingGrup || loadingAnggota;

    return (
        <AdminLayout title="Peta Sebaran">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left flex flex-col gap-6">

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-[#0080C5]/10 rounded-xl flex items-center justify-center text-[#0080C5]">
                            <Users size={22} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-slate-400">Total Anggota Aktif</p>
                            {loadingAnggota
                                ? <Loader2 size={20} className="animate-spin text-[#0080C5] mt-1" />
                                : <h3 className="text-2xl font-bold text-slate-950">{totalAnggota.toLocaleString('id-ID')}</h3>
                            }
                            <p className="text-[10px] font-medium text-[#0080C5]">Di seluruh wilayah</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-[#00A870]/10 rounded-xl flex items-center justify-center text-[#00A870]">
                            <LayoutGrid size={22} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-slate-400">Grup Dampingan</p>
                            {loadingGrup
                                ? <Loader2 size={20} className="animate-spin text-[#00A870] mt-1" />
                                : <h3 className="text-2xl font-bold text-slate-950">{totalGrup.toLocaleString('id-ID')}</h3>
                            }
                            <p className="text-[10px] font-medium text-[#00A870]">Aktif di seluruh Indonesia</p>
                        </div>
                    </div>
                </div>

                {/* Map Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col flex-1 min-h-[480px]">
                    <div className="mb-4">
                        <h2 className="text-base font-bold text-slate-950 tracking-tight">Peta Sebaran Anggota</h2>
                        <p className="text-xs font-medium text-[#0080C5]">Distribusi anggota dan grup dampingan per kabupaten/kota — data real dari sistem</p>
                    </div>

                    {/* Legenda */}
                    <div className="flex items-center gap-5 mb-4 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded bg-[#0080C5] opacity-70" />
                            <span>Ada data dampingan</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded bg-slate-200" />
                            <span>Belum ada data</span>
                        </div>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden bg-sky-50/30 flex-1 border border-gray-200 z-0">
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                                <div className="w-10 h-10 border-4 border-[#0080C5]/20 border-t-[#0080C5] rounded-full animate-spin" />
                                <p className="mt-3 text-sm font-semibold text-[#0080C5]">Memuat data peta...</p>
                            </div>
                        )}
                        <MapContainer
                            center={[-2.5489, 118.0149]}
                            zoom={5}
                            style={{ height: '450px', width: '100%', borderRadius: '1rem' }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            />
                            {geoData && !isLoading && (
                                <GeoJSON
                                    data={geoData}
                                    style={styleFeature}
                                    onEachFeature={onEachFeature}
                                />
                            )}
                        </MapContainer>
                    </div>

                    <p className="mt-4 text-right text-[10px] text-[#0080C5]/60 italic">
                        * Klik pada area kabupaten/kota untuk melihat detail statistik
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PetaSebaranPage;
