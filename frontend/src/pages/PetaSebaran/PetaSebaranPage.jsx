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
            <div className="p-4 lg:p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left flex flex-col gap-4 lg:gap-6">

                {/* Stat Cards */}
                <div className="flex flex-row lg:flex lg:flex-row justify-between gap-3 lg:gap-[20px] shrink-0 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 hide-scrollbar lg:w-[1102px] lg:mx-auto lg:mt-[35px]">
                    {/* Total Anggota Card */}
                    <div className="bg-white rounded-[16px] lg:rounded-[16px] p-4 lg:py-[22px] lg:px-[26px] border-[0.8px] lg:border-none border-[#F0F2F8] shadow-sm flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-[21px] min-w-[150px] flex-1 lg:flex-none lg:w-[541px] lg:h-[123.1px]">
                        <div className="w-10 h-10 lg:w-[52px] lg:h-[52px] bg-[#0080C5]/10 rounded-[14px] lg:rounded-[14px] flex items-center justify-center shrink-0 text-[#0080C5]">
                            <Users size={20} className="lg:hidden stroke-[1.8]" />
                            {/* Desktop Icon based on Figma */}
                            <svg className="hidden lg:block w-[28px] h-[28px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" fill="#0080C5"/>
                                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#0080C5"/>
                            </svg>
                        </div>
                        <div className="flex flex-col mt-1 lg:mt-0 lg:gap-[3px]">
                            <p className="text-[10px] lg:text-[12px] font-semibold text-[#9298B0] lg:leading-[18px]">Total Anggota</p>
                            {loadingAnggota
                                ? <Loader2 size={16} className="animate-spin text-[#0080C5] mt-1 lg:w-5 lg:h-5" />
                                : <h3 className="text-[24px] lg:text-[26px] font-bold text-[#0A0F1E] leading-[32px] lg:leading-[39px] mt-1 lg:mt-0">{totalAnggota.toLocaleString('id-ID')}</h3>
                            }
                            <p className="text-[10px] lg:text-[11px] font-medium text-[#0080C5] lg:leading-[16px] mt-1 lg:mt-0">Di 34 provinsi Indonesia</p>
                        </div>
                    </div>

                    {/* Grup Dampingan Card */}
                    <div className="bg-white rounded-[16px] lg:rounded-[16px] p-4 lg:py-[22px] lg:px-[26px] border-[0.8px] lg:border-none border-[#F0F2F8] shadow-sm flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-[21px] min-w-[150px] flex-1 lg:flex-none lg:w-[541px] lg:h-[123.1px]">
                        <div className="w-10 h-10 lg:w-[52px] lg:h-[52px] bg-[#00C580]/10 rounded-[14px] lg:rounded-[14px] flex items-center justify-center shrink-0 text-[#00C580] lg:text-[#00C580]">
                            <LayoutGrid size={20} className="lg:hidden stroke-[1.8]" />
                            {/* Desktop Icon based on Figma */}
                            <svg className="hidden lg:block w-[28px] h-[28px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="3" width="7" height="7" rx="1" stroke="#00C580" strokeWidth="2"/>
                                <rect x="14" y="3" width="7" height="7" rx="1" stroke="#00C580" strokeWidth="2"/>
                                <rect x="14" y="14" width="7" height="7" rx="1" stroke="#00C580" strokeWidth="2"/>
                                <rect x="3" y="14" width="7" height="7" rx="1" stroke="#00C580" strokeWidth="2"/>
                            </svg>
                        </div>
                        <div className="flex flex-col mt-1 lg:mt-0 lg:gap-[3px]">
                            <p className="text-[10px] lg:text-[12px] font-semibold text-[#9298B0] lg:leading-[18px]">Grup Dampingan</p>
                            {loadingGrup
                                ? <Loader2 size={16} className="animate-spin text-[#00A870] mt-1 lg:w-5 lg:h-5" />
                                : <h3 className="text-[24px] lg:text-[26px] font-bold text-[#0A0F1E] leading-[32px] lg:leading-[39px] mt-1 lg:mt-0">{totalGrup.toLocaleString('id-ID')}</h3>
                            }
                            <p className="text-[10px] lg:text-[11px] font-medium text-[#00A870] lg:leading-[16px] mt-1 lg:mt-0">Aktif Di Seluruh Indonesia</p>
                        </div>
                    </div>
                </div>

                {/* Map Card */}
                <div className="bg-white rounded-[16px] lg:rounded-[20px] border-[0.8px] lg:border-none border-[#F0F2F8] shadow-sm flex flex-col overflow-hidden min-h-[400px] lg:h-[644.88px] lg:w-[1102px] lg:mx-auto lg:p-[30.8px_32.8px]">
                    <div className="p-[16.8px] pb-2 lg:p-0 lg:mb-[15px]">
                        <h2 className="text-[14px] lg:text-[16px] font-bold text-[#0A0F1E] leading-[21px] lg:leading-[24px]">Peta Sebaran Anggota</h2>
                        <p className="text-[11px] lg:text-[12px] font-normal lg:font-medium text-[#0080C5] leading-[16px] lg:leading-[18px]">Distribusi anggota dan grup dampingan per provinsi di Indonesia</p>
                    </div>

                    {/* Legenda (Desktop Only) - Hidden based on CSS provided but we keep it or maybe hide if not in CSS. Actually we can keep it as it's useful, but the CSS didn't explicitly show it. We'll leave it but position nicely. */}
                    <div className="hidden lg:flex items-center gap-5 mb-4 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded bg-[#0080C5] opacity-70" />
                            <span>Ada data dampingan</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded bg-[#CBD5E1]" />
                            <span>Belum ada data</span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden bg-[#F0F2F8]/30 lg:bg-sky-50/30 flex-1 z-0 h-[350px] lg:h-auto mx-1 lg:mx-0 rounded-[20px] lg:rounded-2xl lg:border lg:border-gray-200">
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 border-4 border-[#0080C5]/20 border-t-[#0080C5] rounded-full animate-spin" />
                                <p className="mt-3 text-[13px] lg:text-sm font-semibold text-[#0080C5]">Memuat data peta...</p>
                            </div>
                        )}
                        <MapContainer
                            center={[-2.5489, 118.0149]}
                            zoom={4.5}
                            style={{ height: '100%', minHeight: '350px', width: '100%' }}
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

                    <div className="px-4 py-2 lg:px-0 lg:py-0 lg:mt-4">
                        <p className="text-[10px] text-[#0080C5]/70 italic text-right lg:text-slate-400">
                            * Ketuk pin provinsi untuk melihat detail
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PetaSebaranPage;
