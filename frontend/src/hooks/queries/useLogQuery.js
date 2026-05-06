import { useQuery } from '@tanstack/react-query';
import { logService } from '../../services/logService';
import { queryKeys } from '../../constants/queryKeys';

export const useLogs = (params) => {
    return useQuery({
        queryKey: [queryKeys.LOG_AKTIVITAS, params],
        queryFn: () => logService.getAll(params),
    });
};

export const useLogDetail = (id) => {
    return useQuery({
        queryKey: [queryKeys.LOG_AKTIVITAS, id],
        queryFn: () => logService.getById(id),
        enabled: !!id,
    });
};
