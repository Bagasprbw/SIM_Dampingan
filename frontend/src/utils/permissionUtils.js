import { getUser, getPermissions } from './storage';

/**
 * Check if user has a specific permission
 * @param {string} permissionCode - The permission code to check
 * @returns {boolean} True if user has the permission
 */
export const hasPermission = (permissionCode) => {
    const permissions = getPermissions();
    if (!permissions || !Array.isArray(permissions)) {
        return false;
    }
    return permissions.includes(permissionCode);
};

/**
 * Check if user has ANY of the provided permissions
 * @param {string|string[]} permissionCodes - Single permission code or array of codes
 * @returns {boolean} True if user has at least one permission
 */
export const hasAnyPermission = (permissionCodes) => {
    const codes = Array.isArray(permissionCodes) ? permissionCodes : [permissionCodes];
    return codes.some(code => hasPermission(code));
};

/**
 * Check if user has ALL of the provided permissions
 * @param {string[]} permissionCodes - Array of permission codes
 * @returns {boolean} True if user has all permissions
 */
export const hasAllPermissions = (permissionCodes) => {
    if (!Array.isArray(permissionCodes)) {
        return hasPermission(permissionCodes);
    }
    return permissionCodes.every(code => hasPermission(code));
};

/**
 * Get all user permissions
 * @returns {string[]} Array of permission codes
 */
export const getAllPermissions = () => {
    return getPermissions() || [];
};

/**
 * Check if user is superadmin
 * @returns {boolean} True if user is superadmin
 */
export const isSuperAdmin = () => {
    const user = getUser();
    return user?.role === 'superadmin' || user?.username === 'superadmin';
};

/**
 * Check if user is an admin (any admin level)
 * @returns {boolean} True if user is any level of admin
 */
export const isAdmin = () => {
    const user = getUser();
    if (!user?.role) return false;
    const role = user.role;
    return role === 'admin_provinsi' || role === 'admin_kabupaten' || role === 'admin_kecamatan';
};

/**
 * Check if user is a fasilitator
 * @returns {boolean} True if user is a fasilitator
 */
export const isFasilitator = () => {
    const user = getUser();
    return user?.role === 'fasilitator';
};

/**
 * Check if user is a PJ Grup
 * @returns {boolean} True if user is a PJ Grup
 */
export const isPjGrup = () => {
    const user = getUser();
    return user?.role === 'pj_grup';
};
