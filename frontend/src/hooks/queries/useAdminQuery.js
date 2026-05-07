import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { queryKeys } from '../../constants/queryKeys';

export const useAdmins = (params) => {
    return useQuery({
        queryKey: [queryKeys.ADMIN, params],
        queryFn: () => adminService.getAll(params),
    });
};

export const useAdmin = (id) => {
    return useQuery({
        queryKey: [queryKeys.ADMIN, id],
        queryFn: () => adminService.getById(id),
        enabled: !!id,
    });
};
