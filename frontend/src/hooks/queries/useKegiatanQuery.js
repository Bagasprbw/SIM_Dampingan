import { useQuery } from '@tanstack/react-query';
import { kegiatanService } from '../../services/kegiatanService';
import { queryKeys } from '../../constants/queryKeys';

export const useKegiatansAdmin = (params) => {
    return useQuery({
        queryKey: [queryKeys.KEGIATAN, 'admin', params],
        queryFn: () => kegiatanService.getAllAdmin(params),
    });
};

export const useKegiatansFasilitator = (params) => {
    return useQuery({
        queryKey: [queryKeys.KEGIATAN, 'fasilitator', params],
        queryFn: () => kegiatanService.getAllFasilitator(params),
    });
};

export const useKegiatanFasilitator = (id) => {
    return useQuery({
        queryKey: [queryKeys.KEGIATAN, 'fasilitator', id],
        queryFn: () => kegiatanService.getByIdFasilitator(id),
        enabled: !!id,
    });
};
