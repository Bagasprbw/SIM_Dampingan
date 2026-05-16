import { useQuery } from '@tanstack/react-query';
import { bidangService } from '../../services/bidangService';
import { queryKeys } from '../../constants/queryKeys';

export const useBidangs = () => {
    return useQuery({
        queryKey: [queryKeys.BIDANG || 'bidang'],
        queryFn: () => bidangService.getAll(),
    });
};
