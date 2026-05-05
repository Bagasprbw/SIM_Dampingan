import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Users, LayoutGrid } from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const PetaSebaranPage = () => {
    const [geoData, setGeoData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch GeoJSON data for Kabupaten/Kota Indonesia
        fetch('https://raw.githubusercontent.com/rifani/geojson-political-indonesia/master/IDN_adm_2_kabkota.json')
            .then((response) => response.json())
            .then((data) => {
                setGeoData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching GeoJSON:', error);
                setLoading(false);
            });
    }, []);

    // Function to style each feature (Kabupaten)
    const styleFeature = (feature) => {
        return {
            fillColor: '#0080C5',  // Biru khas
            weight: 0.5,           // Border tipis
            opacity: 1,
            color: '#bae6fd',      // Warna garis batas (sky-200)
            fillOpacity: 0.15      // Cukup tipis agar basemap terlihat
        };
    };

    // Function to handle interactions with each feature
    const onEachFeature = (feature, layer) => {
        // Randomize data for demo purposes
        const totalAnggota = Math.floor(Math.random() * 500) + 10;
        const totalGrup = Math.floor(Math.random() * 50) + 1;
        const kabName = feature.properties.NAME_2 || feature.properties.KABKOT || 'Kabupaten Tidak Diketahui';

        layer.bindPopup(`
            <div style="font-family: 'Poppins', sans-serif; text-align: left; min-width: 150px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #0f172a;">${kabName}</h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 12px; color: #64748b;">Total Anggota:</span>
                    <span style="font-size: 12px; font-weight: 600; color: #0080C5;">${totalAnggota}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-size: 12px; color: #64748b;">Grup Dampingan:</span>
                    <span style="font-size: 12px; font-weight: 600; color: #00A870;">${totalGrup}</span>
                </div>
            </div>
        `);

        layer.on({
            mouseover: (e) => {
                const l = e.target;
                l.setStyle({
                    fillColor: '#0080C5', // Warna saat di-hover
                    weight: 1.5,
                    color: '#ffffff',
                    fillOpacity: 1
                });
                l.bringToFront();
            },
            mouseout: (e) => {
                layer.setStyle(styleFeature(feature));
            }
        });
    };

    return (
        <AdminLayout title="Peta Sebaran">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left flex flex-col">
                
                {/* 1. Stat Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
                    {/* Card Total Anggota */}
                    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-[#0080C5]/10 rounded-xl flex items-center justify-center text-[#0080C5]">
                            <Users size={24} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[11px] font-semibold text-slate-400 tracking-tight">Total Anggota</p>
                            <h3 className="text-2xl font-bold text-slate-950">12.000</h3>
                            <p className="text-[10px] font-medium text-[#0080C5]">Di seluruh Indonesia</p>
                        </div>
                    </div>

                    {/* Card Grup Dampingan */}
                    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-[#00A870]/10 rounded-xl flex items-center justify-center text-[#00A870]">
                            <LayoutGrid size={24} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[11px] font-semibold text-slate-400 tracking-tight">Grup Dampingan</p>
                            <h3 className="text-2xl font-bold text-slate-950">12.000</h3>
                            <p className="text-[10px] font-medium text-[#00A870]">Aktif Di Seluruh Indonesia</p>
                        </div>
                    </div>
                </div>

                {/* 2. Map Container Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative flex-1 flex flex-col min-h-[480px]">
                    <div className="mb-4 space-y-0.5 shrink-0">
                        <h2 className="text-base font-bold text-slate-950 tracking-tight">Peta Sebaran Anggota</h2>
                        <p className="text-xs font-medium text-[#0080C5]">Distribusi anggota dan grup dampingan per kabupaten/kota di Indonesia</p>
                    </div>

                    {/* Map Area */}
                    <div className="relative rounded-2xl overflow-hidden bg-sky-50/30 flex-1 border border-gray-200 z-0">
                        {loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                                <div className="w-10 h-10 border-4 border-[#0080C5]/20 border-t-[#0080C5] rounded-full animate-spin"></div>
                                <p className="mt-4 text-sm font-semibold text-[#0080C5]">Memuat data peta...</p>
                            </div>
                        ) : null}

                        <MapContainer 
                            center={[-2.5489, 118.0149]} 
                            zoom={5} 
                            style={{ height: '450px', width: '100%', borderRadius: '1rem' }} 
                            zoomControl={true}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            />
                            {geoData && (
                                <GeoJSON 
                                    data={geoData} 
                                    style={styleFeature} 
                                    onEachFeature={onEachFeature} 
                                />
                            )}
                        </MapContainer>
                    </div>

                    {/* Map Footer Note */}
                    <div className="mt-6 text-right shrink-0">
                        <p className="text-xs font-medium text-[#0080C5]/70 italic tracking-tight">
                            * Klik pada area kabupaten untuk melihat detail statistik
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PetaSebaranPage;
