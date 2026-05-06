import { useQuery } from '@tanstack/react-query';
import { wilayahService } from '../../services/wilayahService';

export const useProvinsi = () =>
    useQuery({
        queryKey: ['wilayah', 'provinsi'],
        queryFn: () => wilayahService.getProvinsi(),
        staleTime: Infinity, // Data wilayah jarang berubah
    });

export const useKabupaten = (kodeProvinsi) =>
    useQuery({
        queryKey: ['wilayah', 'kabupaten', kodeProvinsi],
        queryFn: () => wilayahService.getKabupaten(kodeProvinsi),
        enabled: !!kodeProvinsi,
        staleTime: Infinity,
    });

export const useKecamatan = (kodeKabupaten) =>
    useQuery({
        queryKey: ['wilayah', 'kecamatan', kodeKabupaten],
        queryFn: () => wilayahService.getKecamatan(kodeKabupaten),
        enabled: !!kodeKabupaten,
        staleTime: Infinity,
    });
