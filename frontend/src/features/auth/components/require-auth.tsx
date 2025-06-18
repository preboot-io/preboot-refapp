import { Navigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../api/auth-service.ts";
import { useEffect } from "react";
import {getDefaultRouteForUser, UserRole} from "@/config/role-routes.ts";
import {UserAccountInfo} from "@/generated/models";

interface RequireAuthProps {
    children: React.ReactNode | ((props: { currentUser: UserAccountInfo }) => React.ReactNode);
    roles?: string[]; // Optional array of required roles
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const queryClient = useQueryClient();

    // Query for current user data
    const { data: currentUser, isLoading: isLoadingUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: authService.getCurrentUser,
        // Only fetch if we have a token
        enabled: !!token,
        // Keep the data fresh
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const { refetch: refreshToken } = useQuery({
        queryKey: ['auth', 'refresh'],
        queryFn: async () => {
            try {
                const response = await authService.refreshToken();
                localStorage.setItem('token', response.token);
                // After token refresh, refetch user data
                await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
                return response;
            } catch (error) {
                localStorage.removeItem('token');
                queryClient.clear();
                throw error;
            }
        },
        enabled: false,
        retry: 2,
    });

    useEffect(() => {
        if (!token) return;

        const intervalId = setInterval(() => {
            refreshToken();
        }, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [token, refreshToken]);

    // Handle no token case
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (isLoadingUser || !currentUser) {
        // You might want to show a loading spinner here
        return null;
    }

    // Check if user has required roles
    if (roles && roles.length > 0) {
        const hasRequiredRole = currentUser?.roles?.some(role => roles.includes(role as UserRole));

        if (!hasRequiredRole) {
            // Redirect to user's default route instead of hardcoded dashboard
            const defaultRoute = getDefaultRouteForUser(currentUser?.roles || []);
            return <Navigate to={defaultRoute} replace />;
        }
    }

    // Handle both function and element children
    if (typeof children === 'function') {
        return <>{children({ currentUser })}</>;
    }
    return <>{children}</>;
}
