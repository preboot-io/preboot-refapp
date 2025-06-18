import { Group, Menu, UnstyledButton, Text, Loader } from '@mantine/core';
import { TbChevronDown, TbBuilding } from 'react-icons/tb';
import { useCurrentUser } from '../hooks/use-current-user';
import { useTenants } from '../hooks/use-tenants';
import classes from './tenant-switcher.module.css';

export function TenantSwitcher() {
    const { data: currentUser } = useCurrentUser();
    const { tenants, isLoadingTenants, switchTenant } = useTenants();

    if (isLoadingTenants) {
        return <Loader size="sm" />;
    }

    // If user has only one tenant, just show the tenant name
    if (tenants.length <= 1) {
        return (
            <Group gap="xs" justify="center">
                <TbBuilding size={20} />
                <Text size="sm">{currentUser?.tenantName}</Text>
            </Group>
        );
    }

    return (
        <Menu position="bottom-end" offset={8} withArrow>
            <Menu.Target>
                <UnstyledButton className={classes.control}>
                    <Group gap="xs" justify="center">
                        <TbBuilding size={20} />
                        <Text size="sm">{currentUser?.tenantName}</Text>
                        <TbChevronDown size={16} />
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                {tenants.map((tenant) => (
                    <Menu.Item
                        key={tenant.uuid}
                        onClick={() => switchTenant.mutate(tenant.uuid!)}
                        disabled={tenant.uuid === currentUser?.tenantId}
                    >
                        {tenant.name}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}
