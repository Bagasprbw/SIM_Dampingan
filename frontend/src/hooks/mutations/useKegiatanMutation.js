import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kegiatanService } from '../../services/kegiatanService';
import { queryKeys } from '../../constants/queryKeys';

export const useKegiatanMutations = () => {
    const queryClient = useQueryClient();

    const invalidateKegiatans = () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.KEGIATAN] });
    };

    const createKegiatan = useMutation({
        mutationFn: (data) => kegiatanService.create(data),
        onSuccess: () => {
            invalidateKegiatans();
        },
    });

    const updateKegiatan = useMutation({
        mutationFn: ({ id, data }) => kegiatanService.update(id, data),
        onSuccess: () => {
            invalidateKegiatans();
        },
    });

    const deleteKegiatan = useMutation({
        mutationFn: (id) => kegiatanService.delete(id),
        onSuccess: () => {
            invalidateKegiatans();
        },
    });

    return {
        createKegiatan,
        updateKegiatan,
        deleteKegiatan,
    };
};
