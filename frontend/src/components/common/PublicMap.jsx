import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const mapApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
});

const usePetaData = () =>
    useQuery({
        queryKey: ['public_peta'],
        queryFn: async () => {
            const res = await mapApi.get('/public/peta-sebaran');
            return res.data;
        },
    });

const PublicMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [geoLoading, setGeoLoading] = useState(true);
    const [hoveredKabupaten, setHoveredKabupaten] = useState(null);

    const { data: petaData, isLoading: loadingPeta } = usePetaData();

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/rifani/geojson-political-indonesia/master/IDN_adm_2_kabkota.json')
            .then(r => r.json())
            .then(d => { setGeoData(d); setGeoLoading(false); })
            .catch(() => setGeoLoading(false));
    }, []);

    const statsMap = useMemo(() => {
        const map = {};
        const list = petaData?.data;
        if (!Array.isArray(list)) return map;

        list.forEach(({ name, grup, anggota }) => {
            if (!name) return;
            map[name] = { grup: grup ?? 0, anggota: anggota ?? 0 };
        });

        return map;
    }, [petaData]);

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
            color: 'white',
            fillOpacity: hasData ? 0.7 : 0.3
        };
    };

    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 2,
                    color: '#0080C5',
                    fillOpacity: 0.9
                });
                layer.bringToFront();

                const stats = getStatsForFeature(feature);
                setHoveredKabupaten({
                    name: feature.properties.NAME_2 || feature.properties.KABKOT,
                    stats: stats || { grup: 0, anggota: 0 }
                });
            },
            mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(styleFeature(feature));
                setHoveredKabupaten(null);
            }
        });
    };

    const isLoading = geoLoading || loadingPeta;

    if (isLoading) {
        return (
            <div className="w-full h-[400px] bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0080C5]" />
                    <span className="text-sm font-medium text-slate-500">Memuat Peta Sebaran...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-sm z-10 bg-white border border-slate-200">
            {hoveredKabupaten && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-100 z-[1000] min-w-[200px] transition-all">
                    <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">
                        {hoveredKabupaten.name}
                    </h4>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">Grup Dampingan</span>
                            <span className="font-bold text-[#0080C5]">{hoveredKabupaten.stats.grup}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">Total Anggota</span>
                            <span className="font-bold text-emerald-600">{hoveredKabupaten.stats.anggota}</span>
                        </div>
                    </div>
                </div>
            )}

            <MapContainer
                center={[-2.5489, 118.0149]}
                zoom={5}
                className="w-full h-full z-0"
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
    );
};

export default PublicMap;
