import { useQuery } from '@tanstack/react-query';
import { anggotaService } from '../../services/anggotaService';
import { queryKeys } from '../../constants/queryKeys';

export const useAnggotas = (params) => {
    const { enabled, ...queryParams } = params || {};
    return useQuery({
        queryKey: [queryKeys.ANGGOTA, queryParams],
        queryFn: () => anggotaService.getAll(queryParams),
        enabled: enabled !== undefined ? enabled : true,
    });
};

export const useAnggota = (id) => {
    return useQuery({
        queryKey: [queryKeys.ANGGOTA, id],
        queryFn: () => anggotaService.getById(id),
        enabled: !!id,
    });
};
