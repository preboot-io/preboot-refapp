import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users-service';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { notifications } from '@mantine/notifications';
import {
    CreateInactiveUserAccountRequest,
    SearchRequest
} from '@/generated/models';
import { useTranslation } from 'react-i18next';

export function useUsers() {
    const queryClient = useQueryClient();
    const { data: currentUser } = useCurrentUser();
    const { t } = useTranslation();

    // Get paginated users for the current tenant
    const getUsersWithParams = async (params: SearchRequest) => {
        if (!currentUser?.tenantId) {
            return { content: [], totalElements: 0, number: 0, size: 10, last: true };
        }
        return await usersApi.searchUsers(params);
    };

    // We'll now use this function in the component to get users with the current pagination params

    // Create a new user
    const createUser = useMutation({
        mutationFn: (data: Omit<CreateInactiveUserAccountRequest, 'tenantId'>) => {
            if (!currentUser?.tenantId) {
                throw new Error('No tenant ID available');
            }

            return usersApi.createUser({
                ...data,
                tenantId: currentUser.tenantId
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-users'] });
            notifications.show({
                title: t('common.success'),
                message: t('features.users.notifications.created'),
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: t('common.errors.title'),
                message: error instanceof Error ? error.message : t('common.errors.serverError'),
                color: 'red',
            });
        },
    });

    // Update user roles
    const updateUserRoles = useMutation({
        mutationFn: (params: { userId: string; roles: string[] }) => {
            return usersApi.updateUserRoles(params.userId, params.roles);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-users'] });
            notifications.show({
                title: t('common.success'),
                message: t('features.users.notifications.rolesUpdated'),
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: t('common.errors.title'),
                message: error instanceof Error ? error.message : t('common.errors.serverError'),
                color: 'red',
            });
        },
    });

    // Remove a user from the tenant
    const removeUser = useMutation({
        mutationFn: (userId: string) => usersApi.removeUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-users'] });
            notifications.show({
                title: t('common.success'),
                message: t('features.users.notifications.removed'),
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: t('common.errors.title'),
                message: error instanceof Error ? error.message : t('common.errors.serverError'),
                color: 'red',
            });
        },
    });

    // Add a role to a user
    const addRole = useMutation({
        mutationFn: (params: { userId: string; roleName: string }) => {
            return usersApi.addRole(params.userId, params.roleName);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-users'] });
        }
    });

    // Remove a role from a user
    const removeRole = useMutation({
        mutationFn: (params: { userId: string; roleName: string }) => {
            return usersApi.removeRole(params.userId, params.roleName);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-users'] });
        }
    });

    // Available roles - this could be fetched from an API endpoint if available
    const availableRoles = ['ADMIN', 'USER'];

    return {
        getUsersWithParams,
        createUser,
        updateUserRoles,
        removeUser,
        addRole,
        removeRole,
        availableRoles,
    };
}
