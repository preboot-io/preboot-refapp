import {useState} from 'react';
import {AppShell, Group, Stack, Text, Tooltip, UnstyledButton} from '@mantine/core';
import {TbLogout} from 'react-icons/tb';
import {useLocation, useNavigate} from 'react-router-dom';
import classes from './navbar.module.css';
import {useTranslation} from 'react-i18next';
import {getMenuItemsForUser, MenuItem} from '@/config/role-routes.ts';
import {useCurrentUser} from "@/features/auth/hooks/use-current-user.ts";

interface NavLinkProps {
    icon: MenuItem['icon'];
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavLink({ icon: Icon, label, active, onClick }: NavLinkProps) {
    return (
        <>
            <Tooltip label={label} position="right" visibleFrom="sm">
                <UnstyledButton
                    onClick={onClick}
                    className={classes.link}
                    data-active={active || undefined}
                    visibleFrom="sm"
                >
                    <Icon size="1.5rem" />
                </UnstyledButton>
            </Tooltip>

            <UnstyledButton
                onClick={onClick}
                className={classes.mobileLink}
                data-active={active || undefined}
                hiddenFrom="sm"
            >
                <Group gap="sm">
                    <Icon size="1.5rem" />
                    <Text size="sm">{label}</Text>
                </Group>
            </UnstyledButton>
        </>
    );
}

export function AppNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState(location.pathname);
    const { t } = useTranslation();

    const { data: currentUser } = useCurrentUser();

    // Get menu items based on user roles and permissions
    const navLinks = currentUser ? getMenuItemsForUser(currentUser) : [];

    const links = navLinks.map((link) => (
        <NavLink
            {...link}
            key={link.label}
            label={t(link.label)}
            active={active === link.path}
            onClick={() => {
                setActive(link.path);
                navigate(link.path);
            }}
        />
    ));

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppShell.Navbar p="md" withBorder={false}>
            <Stack justify="space-between" h="100%">
                <Stack gap="md">
                    {links}
                </Stack>

                <NavLink
                    icon={TbLogout}
                    label={t('layout.nav.logout')}
                    onClick={handleLogout}
                />
            </Stack>
        </AppShell.Navbar>
    );
}
