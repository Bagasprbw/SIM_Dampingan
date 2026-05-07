import { useQuery } from '@tanstack/react-query';
import { panduanService } from '../../services/panduanService';
import { queryKeys } from '../../constants/queryKeys';

export const usePanduansKelola = (params) => {
    return useQuery({
        queryKey: [queryKeys.PANDUAN, 'kelola', params],
        queryFn: () => panduanService.getAllKelola(params),
    });
};

export const usePanduansView = (params) => {
    return useQuery({
        queryKey: [queryKeys.PANDUAN, 'view', params],
        queryFn: () => panduanService.getAllView(params),
    });
};
