import {Badge, Box, Button, Group, Text, Title} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {tenantsApi} from '@/features/tenants/api/tenants-service.ts';
import {TenantUsersTable} from '@/features/tenants/components/tenant-users-table.tsx';
import {TbUserPlus} from 'react-icons/tb';
import {useDisclosure} from '@mantine/hooks';
import {UserFormModal} from '@/features/users/components/user-form-modal.tsx';
import {UserFormValues} from '@/features/users/components/user-form';
import {CreateInactiveUserAccountRequest} from "@/generated/models";
import {superAdminUsersApi} from "@/features/users/api/super-admin-users-service.ts";
import {notifications} from "@mantine/notifications";

export function TenantUsersPage() {
    const {t} = useTranslation();
    const queryClient = useQueryClient();
    const {tenantId} = useParams<{ tenantId: string }>();
    const [opened, {open, close}] = useDisclosure(false);

    const {data, isLoading} = useQuery({
        queryKey: ['tenant'],
        queryFn: () => tenantsApi.getTenant(tenantId!),
        enabled: !!tenantId,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateInactiveUserAccountRequest) =>
            superAdminUsersApi.createTenantUser(tenantId!, data),
        onSuccess: () => {
            notifications.show({
                title: t('common.success'),
                message: t('features.users.notifications.created'),
                color: 'green',
            });
            queryClient.invalidateQueries({ queryKey: ['tenant-users'] });
        },
        onError: error => {
            notifications.show({
                title: t('common.error'),
                message: t('features.users.notifications.createError'),
                color: 'red',
            });
            console.error('Error creating user:', error);
        },
    });

    const handleSubmit = async (values: UserFormValues): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            mutate(
                {
                    username: values.username,
                    email: values.email,
                    roles: values.roles,
                    language: values.language,
                    timezone: values.timezone,
                },
                {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: error => {
                        reject(error);
                    },
                }
            );
        });
    };

    return (
        <Box p="md">
            <Group justify="space-between" mb="lg">
                <Group gap="xs">
                    <Title order={2}>{t('features.users.title')}</Title>
                    {isLoading ? (
                        <Text size="lg" fw={500} fs="italic" c="dimmed">
                            {t('common.loading')}
                        </Text>
                    ) : (
                        <Badge size="xl" radius="sm" variant="filled" color="blue">
                            {data?.name}
                        </Badge>
                    )}
                </Group>
                <Button leftSection={<TbUserPlus/>} onClick={open}>
                    {t('features.users.addUser')}
                </Button>
            </Group>

            <TenantUsersTable isSuperAdmin={true}/>

            <UserFormModal opened={opened}
                           onClose={close}
                           loading={isPending}
                           availableRoles={['ADMIN']}
                           onSubmit={handleSubmit} />
        </Box>
    );
}
