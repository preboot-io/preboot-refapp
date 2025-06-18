import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth-service.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDefaultRouteForUser } from '@/config/role-routes.ts';
import {PasswordLoginRequest} from "@/generated/models";

export function useLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: PasswordLoginRequest) => authService.login(credentials),
        onSuccess: async (data) => {
            localStorage.setItem('token', data.token);

            // Fetch user data
            const userData = await authService.getCurrentUser();
            queryClient.setQueryData(['currentUser'], userData);

            // Determine redirect path:
            // 1. Use the attempted path if it exists
            // 2. Otherwise, use the role-based default route
            const attemptedPath = (location.state as { from?: Location })?.from?.pathname;
            const defaultRoute = getDefaultRouteForUser(userData.roles!);

            navigate(attemptedPath || defaultRoute);
        },
        onError: (error) => {
            localStorage.removeItem('token');
            if (error instanceof Error && location.pathname !== '/login') {
                navigate('/login');
            }
        },
    });
}
