import { useQuery } from '@tanstack/react-query';
import { grupDampinganService } from '../../services/grupDampinganService';
import { queryKeys } from '../../constants/queryKeys';

export const useGrupDampingans = (params) => {
    return useQuery({
        queryKey: [queryKeys.GRUP_DAMPINGAN, params],
        queryFn: () => grupDampinganService.getAll(params),
    });
};

export const useGrupDampingan = (id) => {
    return useQuery({
        queryKey: [queryKeys.GRUP_DAMPINGAN, id],
        queryFn: () => grupDampinganService.getById(id),
        enabled: !!id,
    });
};

export const useFasilitatorGrups = (params) => {
    return useQuery({
        queryKey: [queryKeys.GRUP_DAMPINGAN, 'fasilitator', params],
        queryFn: () => grupDampinganService.getFasilitatorGrup(params),
    });
};

export const usePjGrup = () => {
    return useQuery({
        queryKey: [queryKeys.GRUP_DAMPINGAN, 'pj'],
        queryFn: () => grupDampinganService.getPjGrup(),
    });
};
