import { useMutation, useQueryClient } from '@tanstack/react-query';
import { anggotaService } from '../../services/anggotaService';
import { queryKeys } from '../../constants/queryKeys';

export const useAnggotaMutations = () => {
    const queryClient = useQueryClient();

    const invalidateAnggotas = () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.ANGGOTA] });
    };

    const createAnggota = useMutation({
        mutationFn: (data) => anggotaService.create(data),
        onSuccess: () => {
            invalidateAnggotas();
        },
    });

    const updateAnggota = useMutation({
        mutationFn: ({ id, data }) => anggotaService.update(id, data),
        onSuccess: () => {
            invalidateAnggotas();
        },
    });

    const deleteAnggota = useMutation({
        mutationFn: (id) => anggotaService.delete(id),
        onSuccess: () => {
            invalidateAnggotas();
        },
    });

    return {
        createAnggota,
        updateAnggota,
        deleteAnggota,
    };
};
