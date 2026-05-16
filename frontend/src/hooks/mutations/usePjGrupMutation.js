import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pjGrupService } from '../../services/pjGrupService';
import { queryKeys } from '../../constants/queryKeys';

export const usePjGrupMutations = () => {
    const queryClient = useQueryClient();

    const invalidatePjGrups = () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.PJ_GRUP] });
    };

    const createPjGrup = useMutation({
        mutationFn: (data) => pjGrupService.create(data),
        onSuccess: () => {
            invalidatePjGrups();
        },
    });

    const updatePjGrup = useMutation({
        mutationFn: ({ id, data }) => pjGrupService.update(id, data),
        onSuccess: () => {
            invalidatePjGrups();
        },
    });

    const deletePjGrup = useMutation({
        mutationFn: (id) => pjGrupService.delete(id),
        onSuccess: () => {
            invalidatePjGrups();
        },
    });

    const resetPasswordPjGrup = useMutation({
        mutationFn: (id) => pjGrupService.resetPassword(id),
        onSuccess: () => {
            invalidatePjGrups();
        },
    });

    return {
        createPjGrup,
        updatePjGrup,
        deletePjGrup,
        resetPasswordPjGrup,
    };
};
