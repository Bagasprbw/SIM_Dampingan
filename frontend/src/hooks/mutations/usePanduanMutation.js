import { useMutation, useQueryClient } from '@tanstack/react-query';
import { panduanService } from '../../services/panduanService';
import { queryKeys } from '../../constants/queryKeys';

export const usePanduanMutation = () => {
    const queryClient = useQueryClient();

    const createPanduan = useMutation({
        mutationFn: (data) => panduanService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.PANDUAN] });
        },
    });

    const updatePanduan = useMutation({
        mutationFn: ({ id, data }) => panduanService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.PANDUAN] });
        },
    });

    const deletePanduan = useMutation({
        mutationFn: (id) => panduanService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.PANDUAN] });
        },
    });

    return {
        createPanduan,
        updatePanduan,
        deletePanduan,
    };
};
