import { useQuery } from '@tanstack/react-query';
import { anggotaService } from '../../services/anggotaService';
import { queryKeys } from '../../constants/queryKeys';

export const useAnggotas = (params) => {
    return useQuery({
        queryKey: [queryKeys.ANGGOTA, params],
        queryFn: () => anggotaService.getAll(params),
    });
};

export const useAnggota = (id) => {
    return useQuery({
        queryKey: [queryKeys.ANGGOTA, id],
        queryFn: () => anggotaService.getById(id),
        enabled: !!id,
    });
};
