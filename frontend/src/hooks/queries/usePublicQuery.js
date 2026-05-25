import { useQuery } from '@tanstack/react-query';
import { publicService } from '../../services/publicService';
import { queryKeys } from '../../constants/queryKeys';

export const usePublicStatistics = ({ enabled = true } = {}) => {
    return useQuery({
        queryKey: [queryKeys.PUBLIC_STATISTICS],
        queryFn: () => publicService.getStatistics(),
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
};
