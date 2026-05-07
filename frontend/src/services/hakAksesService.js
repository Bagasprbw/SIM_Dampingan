import api from './api';

export const hakAksesService = {
    getRoles: async () => {
        const response = await api.get('/rbac/roles');
        return response.data;
    },
    getPermissions: async () => {
        const response = await api.get('/rbac/permissions');
        return response.data;
    },
    updateRolePermissions: async (roleId, permissionIds) => {
        const response = await api.put(`/rbac/roles/${roleId}/permissions`, { permission_ids: permissionIds });
        return response.data;
    }
};
