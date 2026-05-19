import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bidangService } from '../../services/bidangService';
import { queryKeys } from '../../constants/queryKeys';

export const useBidangMutations = () => {
    const queryClient = useQueryClient();

    const createBidang = useMutation({
        mutationFn: (data) => bidangService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.BIDANG || 'bidang'] });
        },
    });

    const deleteBidang = useMutation({
        mutationFn: (id) => bidangService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.BIDANG || 'bidang'] });
        },
    });

    return {
        createBidang,
        deleteBidang,
    };
};
