import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hakAksesService } from '../../services/hakAksesService';

export const useRoles = () =>
    useQuery({
        queryKey: ['rbac', 'roles'],
        queryFn: () => hakAksesService.getRoles(),
        staleTime: 0, // selalu re-fetch agar mencerminkan state DB terbaru
    });

export const usePermissions = () =>
    useQuery({
        queryKey: ['rbac', 'permissions'],
        queryFn: () => hakAksesService.getPermissions(),
    });

export const useHakAksesMutations = () => {
    const queryClient = useQueryClient();

    const updateRolePermissions = useMutation({
        mutationFn: ({ roleId, permissions }) => hakAksesService.updateRolePermissions(roleId, permissions),
        onSuccess: () => {
            // Invalidate roles agar data permissions terbaru di-refetch dari DB
            queryClient.invalidateQueries({ queryKey: ['rbac', 'roles'] });
        },
    });

    return { updateRolePermissions };
};
