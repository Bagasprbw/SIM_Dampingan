import { useQuery } from '@tanstack/react-query';
import { fasilitatorService } from '../../services/fasilitatorService';
import { queryKeys } from '../../constants/queryKeys';

export const useFasilitators = (params) => {
    return useQuery({
        queryKey: [queryKeys.FASILITATOR, params],
        queryFn: () => fasilitatorService.getAll(params),
    });
};

export const useFasilitator = (id) => {
    return useQuery({
        queryKey: [queryKeys.FASILITATOR, id],
        queryFn: () => fasilitatorService.getById(id),
        enabled: !!id,
    });
};
