import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { queryKeys } from '../../constants/queryKeys';

export const useAdminMutations = () => {
    const queryClient = useQueryClient();

    const invalidateAdmins = () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.ADMIN] });
    };

    const createAdmin = useMutation({
        mutationFn: (data) => adminService.create(data),
        onSuccess: () => {
            invalidateAdmins();
        },
    });

    const updateAdmin = useMutation({
        mutationFn: ({ id, data }) => adminService.update(id, data),
        onSuccess: () => {
            invalidateAdmins();
        },
    });

    const deleteAdmin = useMutation({
        mutationFn: (id) => adminService.delete(id),
        onSuccess: () => {
            invalidateAdmins();
        },
    });

    return {
        createAdmin,
        updateAdmin,
        deleteAdmin,
    };
};
