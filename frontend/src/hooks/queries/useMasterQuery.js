import { useQuery } from '@tanstack/react-query';
import { masterService } from '../../services/masterService';
import { queryKeys } from '../../constants/queryKeys';

export const useBidangs = () => {
    return useQuery({
        queryKey: ['bidangs'],
        queryFn: () => masterService.getBidangs(),
    });
};

export const usePekerjaans = () => {
    return useQuery({
        queryKey: ['pekerjaans'],
        queryFn: () => masterService.getPekerjaans(),
    });
};
