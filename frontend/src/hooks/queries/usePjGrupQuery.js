import { useQuery } from '@tanstack/react-query';
import { pjGrupService } from '../../services/pjGrupService';
import { queryKeys } from '../../constants/queryKeys';

export const usePjGrups = (params) => {
    return useQuery({
        queryKey: [queryKeys.PJ_GRUP, params],
        queryFn: () => pjGrupService.getAll(params),
    });
};

export const usePjGrup = (id) => {
    return useQuery({
        queryKey: [queryKeys.PJ_GRUP, id],
        queryFn: () => pjGrupService.getById(id),
        enabled: !!id,
    });
};
