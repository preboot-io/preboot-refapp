import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth-service';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { getDefaultRouteForUser } from '@/config/role-routes';

export function useTenants() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
        queryKey: ['tenants'],
        queryFn: authService.getCurrentUserTenants,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const switchTenant = useMutation({
        mutationFn: authService.switchTenant,
        onSuccess: async (data) => {
            // Update token
            localStorage.setItem('token', data.token);

            // Invalidate and refetch user data
            const newUserData = await queryClient.fetchQuery({
                queryKey: ['currentUser'],
                queryFn: authService.getCurrentUser,
            });

            // Navigate to default route based on new roles
            const defaultRoute = getDefaultRouteForUser(newUserData.roles!);
            navigate(defaultRoute);
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Failed to switch organization',
                color: 'red',
            });
        },
    });

    return {
        tenants,
        isLoadingTenants,
        switchTenant,
    };
}
