import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hakAksesService } from '../../services/hakAksesService';
import { queryKeys } from '../../constants/queryKeys';

export const useRoles = () =>
    useQuery({
        queryKey: ['rbac', 'roles'],
        queryFn: () => hakAksesService.getRoles(),
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
            queryClient.invalidateQueries(['rbac']);
        },
    });

    return { updateRolePermissions };
};
