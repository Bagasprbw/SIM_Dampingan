import { useQuery } from '@tanstack/react-query';
import { masterService } from '../../services/masterService';

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
