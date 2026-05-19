import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fasilitatorService } from '../../services/fasilitatorService';
import { queryKeys } from '../../constants/queryKeys';

export const useFasilitatorMutations = () => {
    const queryClient = useQueryClient();

    const invalidateFasilitators = () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.FASILITATOR] });
    };

    const createFasilitator = useMutation({
        mutationFn: (data) => fasilitatorService.create(data),
        onSuccess: () => {
            invalidateFasilitators();
        },
    });

    const updateFasilitator = useMutation({
        mutationFn: ({ id, data }) => fasilitatorService.update(id, data),
        onSuccess: () => {
            invalidateFasilitators();
        },
    });

    const deleteFasilitator = useMutation({
        mutationFn: (id) => fasilitatorService.delete(id),
        onSuccess: () => {
            invalidateFasilitators();
        },
    });

    const resetPasswordFasilitator = useMutation({
        mutationFn: (id) => fasilitatorService.resetPassword(id),
    });

    return {
        createFasilitator,
        updateFasilitator,
        deleteFasilitator,
        resetPasswordFasilitator,
    };
};
