import { useQuery } from '@tanstack/react-query';
import { pengajuanAnggotaService } from '../../services/pengajuanAnggotaService';
import { queryKeys } from '../../constants/queryKeys';

export const usePengajuanAnggotas = (params) => {
    return useQuery({
        queryKey: [queryKeys.PENGAJUAN_ANGGOTA, params],
        queryFn: () => pengajuanAnggotaService.getAll(params),
    });
};

export const usePengajuanAnggotaSaya = (params) => {
    return useQuery({
        queryKey: [queryKeys.PENGAJUAN_ANGGOTA, 'saya', params],
        queryFn: () => pengajuanAnggotaService.indexAjukanSaya(params),
    });
};
