import { useMutation, useQueryClient } from '@tanstack/react-query';
import { grupDampinganService } from '../../services/grupDampinganService';
import { queryKeys } from '../../constants/queryKeys';

export const useGrupDampinganMutations = () => {
    const queryClient = useQueryClient();

    const invalidateGrupDampingans = () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.GRUP_DAMPINGAN] });
    };

    const createGrupDampingan = useMutation({
        mutationFn: (data) => grupDampinganService.create(data),
        onSuccess: () => {
            invalidateGrupDampingans();
        },
    });

    const updateGrupDampingan = useMutation({
        mutationFn: ({ id, data }) => grupDampinganService.update(id, data),
        onSuccess: () => {
            invalidateGrupDampingans();
        },
    });

    const deleteGrupDampingan = useMutation({
        mutationFn: (id) => grupDampinganService.delete(id),
        onSuccess: () => {
            invalidateGrupDampingans();
        },
    });

    return {
        createGrupDampingan,
        updateGrupDampingan,
        deleteGrupDampingan,
    };
};
