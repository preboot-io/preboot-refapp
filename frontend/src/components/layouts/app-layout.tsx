import {AppShell, Box, Burger, Group, Text } from '@mantine/core';
import { AppNavbar } from './navbar';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user.ts';
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {useQueryClient} from "@tanstack/react-query";
import { TenantSwitcher } from '@/features/auth/components/tenant-switcher';

export function AppLayout() {
    const [opened, { toggle }] = useDisclosure();
    const { data: user } = useCurrentUser();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleSessionExpired = () => {
            // Clear user data from React Query cache
            queryClient.setQueryData(['currentUser'], null);

            // Navigate to login with return path
            navigate('/login', {
                state: { from: location },
                replace: true
            });
        };

        // Listen for session expired event
        window.addEventListener('sessionExpired', handleSessionExpired);

        return () => {
            window.removeEventListener('sessionExpired', handleSessionExpired);
        };
    }, [location, navigate, queryClient]);

    return (
        <AppShell
            withBorder={false}
            header={{ height: 70 }}
            navbar={{
                width: 80,
                breakpoint: 'sm',
                collapsed: { mobile: !opened }
            }}
            padding="md"
        >
            <AppShell.Header p="md">
                {/* Mobile header */}
                <Box hiddenFrom="sm" h="100%">
                    <Group justify="space-between" h="100%">
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            size="sm"
                        />
                        <img
                            src="/app-logo.svg"
                            alt="Your App"
                            style={{ height: 30, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
                        />
                        <TenantSwitcher />
                    </Group>
                </Box>

                {/* Desktop header */}
                <Box visibleFrom="sm" h="100%">
                    <Group justify="space-between" h="100%">
                        <img
                            src="/app-logo.svg"
                            alt="Your App"
                            style={{ height: 30 }}
                        />
                        <Text c="dimmed">
                            {t('layout.header.greeting', { username: user?.username })}
                        </Text>
                        <TenantSwitcher />
                    </Group>
                </Box>
            </AppShell.Header>

            <AppNavbar />
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
