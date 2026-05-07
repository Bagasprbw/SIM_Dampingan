import { useQuery } from '@tanstack/react-query';
import { pengajuanAnggotaService } from '../../services/pengajuanAnggotaService';
import { queryKeys } from '../../constants/queryKeys';

export const usePengajuanAnggotas = (params) => {
    return useQuery({
        queryKey: [queryKeys.PENGAJUAN_ANGGOTA, params],
        queryFn: () => pengajuanAnggotaService.getAll(params),
    });
};
