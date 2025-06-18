import {
    CreateInactiveUserAccountRequest,
    PageUserAccountInfo,
    SearchRequest,
    TenantUserAssignRequest,
    UserAccountInfo
} from '@/generated/models';
import {getTenantUserAdminController} from '@/generated/api/tenant-user-admin-controller/tenant-user-admin-controller';

export const usersApi = {
    // Get paginated users for the current tenant
    searchUsers: async (params: SearchRequest): Promise<PageUserAccountInfo> => {
        return await getTenantUserAdminController().searchUsers(params);
    },

    // Create a new user in the current tenant
    createUser: async (data: CreateInactiveUserAccountRequest): Promise<UserAccountInfo> => {
        return getTenantUserAdminController().createUser(data);
    },

    // Update a user's roles
    updateUserRoles: async (userId: string, roles: string[]): Promise<UserAccountInfo> => {
        const request: TenantUserAssignRequest = {
            userUuid: userId,
            roles: roles
        };
        return getTenantUserAdminController().updateUserRoles(userId, request);
    },

    // Add a role to a user
    addRole: async (userId: string, roleName: string): Promise<UserAccountInfo> => {
        return getTenantUserAdminController().addRole(userId, roleName);
    },

    // Remove a role from a user
    removeRole: async (userId: string, roleName: string): Promise<UserAccountInfo> => {
        return getTenantUserAdminController().removeRole(userId, roleName);
    },

    // Get a specific user
    getUser: async (userId: string): Promise<UserAccountInfo> => {
        return getTenantUserAdminController().getUser(userId);
    },

    // Remove a user from the tenant
    removeUser: async (userId: string): Promise<void> => {
        return getTenantUserAdminController().removeUser(userId);
    }
};
