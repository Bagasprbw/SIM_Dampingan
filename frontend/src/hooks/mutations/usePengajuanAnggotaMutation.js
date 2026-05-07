import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pengajuanAnggotaService } from '../../services/pengajuanAnggotaService';
import { queryKeys } from '../../constants/queryKeys';

export const usePengajuanAnggotaMutations = () => {
    const queryClient = useQueryClient();

    const invalidatePengajuanAnggotas = () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.PENGAJUAN_ANGGOTA] });
    };

    const createPengajuanAnggota = useMutation({
        mutationFn: (data) => pengajuanAnggotaService.create(data),
        onSuccess: () => {
            invalidatePengajuanAnggotas();
        },
    });

    const terimaPengajuanAnggota = useMutation({
        mutationFn: (id) => pengajuanAnggotaService.terima(id),
        onSuccess: () => {
            invalidatePengajuanAnggotas();
        },
    });

    const tolakPengajuanAnggota = useMutation({
        mutationFn: (id) => pengajuanAnggotaService.tolak(id),
        onSuccess: () => {
            invalidatePengajuanAnggotas();
        },
    });

    return {
        createPengajuanAnggota,
        terimaPengajuanAnggota,
        tolakPengajuanAnggota,
    };
};
