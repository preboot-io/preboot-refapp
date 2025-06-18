import {useState} from 'react';
import {Badge, Button, Group, Paper, Text, Title} from '@mantine/core';
import {modals} from '@mantine/modals';
import {TbEdit, TbPlus, TbTrash} from 'react-icons/tb';
import {useTranslation} from 'react-i18next';
import {useUsers} from '@/features/users/hooks/use-users';
import {UserFormModal} from '@/features/users/components/user-form-modal';
import {UserFormValues} from '@/features/users/components/user-form';
import {CreateInactiveUserAccountRequest, SearchRequest, UserAccountInfo} from '@/generated/models';
import {config} from '@/config/env';
import {
    Column,
    createSearchRequest,
    RowAction,
    SearchParams,
    TableData,
    tableRenderers
} from '@preboot.io/preboot-ui-community';
import {useCurrentUser} from '@/features/auth/hooks/use-current-user';
import {useQuery} from '@tanstack/react-query';
import {StyledDataTable} from "@/components/styled/styled-data-table/styled-data-table.tsx";

export function UsersPage() {
    const { t } = useTranslation();
    const { data: currentUser } = useCurrentUser();
    const [createModalOpened, setCreateModalOpened] = useState(false);
    const [editingUser, setEditingUser] = useState<UserAccountInfo | null>(null);
    const [queryParams, setQueryParams] = useState<SearchRequest>(
        createSearchRequest(0, 10, 'username')
    );

    const {
        getUsersWithParams,
        createUser,
        updateUserRoles,
        removeUser,
        availableRoles
    } = useUsers();

    // Query for users with current pagination params
    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['tenant-users', currentUser?.tenantId, queryParams],
        queryFn: () => getUsersWithParams(queryParams),
        enabled: !!currentUser?.tenantId,
    });

    const handleCreateUser = async (values: UserFormValues) => {
        const request: Omit<CreateInactiveUserAccountRequest, 'tenantId'> = {
            username: values.username,
            email: values.email,
            roles: values.roles,
            language: values.language,
            timezone: values.timezone
        };

        await createUser.mutateAsync(request);
        setCreateModalOpened(false);
    };

    const handleUpdateRoles = async (values: UserFormValues) => {
        if (!editingUser) return;

        await updateUserRoles.mutateAsync({
            userId: editingUser.uuid!,
            roles: values.roles
        });

        setEditingUser(null);
    };

    const handleDeleteUser = (user: UserAccountInfo) => {
        modals.openConfirmModal({
            title: t('features.users.delete.confirmTitle'),
            children: (
                <Text size="sm">
                    {t('features.users.delete.confirmMessage', { username: user.username })}
                </Text>
            ),
            labels: { confirm: t('common.buttons.delete'), cancel: t('common.buttons.cancel') },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                removeUser.mutateAsync(user.uuid!);
            }
        });
    };

    // Custom renderer for roles
    const renderRoles = (
        _: string | boolean | string[] | undefined,
        item: UserAccountInfo
    ): React.ReactNode => {
        // Use the roles from the item, which is safer
        const roles = item.roles || [];

        return (
            <Group gap="xs">
                {roles.map((role: string) => (
                    <Badge key={role} variant="outline">
                        {t(`features.users.roles.${role}`, role)}
                    </Badge>
                ))}
            </Group>
        );
    };

    // Define table columns
    const columns: Column<UserAccountInfo>[] = [
        {
            key: 'username',
            label: t('features.users.table.columns.username'),
            sortable: true,
            filterable: true,
            filterType: 'text',
        },
        {
            key: 'email',
            label: t('features.users.table.columns.email'),
            sortable: true,
            filterable: true,
            filterType: 'text',
        },
        {
            key: 'active',
            label: t('features.users.table.columns.status'),
            sortable: true,
            render: (value) => tableRenderers.boolean({
                activeLabel: t('features.users.status.active'),
                inactiveLabel: t('features.users.status.inactive'),
                activeColor: 'green',
                inactiveColor: 'red'
            })(Boolean(value))
        },
        {
            key: 'roles',
            label: t('features.users.table.columns.roles'),
            render: renderRoles
        }
    ];

    // Define row actions
    const rowActions: RowAction<UserAccountInfo>[] = [
        {
            label: t('features.users.actions.editRoles'),
            icon: TbEdit,
            onClick: (user) => setEditingUser(user)
        },
        {
            label: t('features.users.actions.delete'),
            icon: TbTrash,
            color: 'red',
            onClick: handleDeleteUser
        }
    ];

    return (
        <div>
            <Group justify="space-between" mb="lg">
                <Title order={2}>{t('features.users.title')}</Title>
                {config.ENABLE_REGISTRATION && (
                    <Button
                        leftSection={<TbPlus size={20} />}
                        onClick={() => setCreateModalOpened(true)}
                    >
                        {t('features.users.createButton')}
                    </Button>
                )}
            </Group>

            <Paper p="md" withBorder>
                <StyledDataTable<UserAccountInfo>
                    data={usersData as TableData || { content: [], totalElements: 0, number: 0, size: 10, last: true }}
                    columns={columns}
                    loading={isLoadingUsers}
                    onParamsChange={setQueryParams}
                    currentParams={queryParams as unknown as SearchParams}
                    rowActions={rowActions}
                    noRecordsText={t('features.users.noUsers.message')}
                />
            </Paper>

            <UserFormModal
                opened={createModalOpened}
                onClose={() => setCreateModalOpened(false)}
                availableRoles={availableRoles}
                onSubmit={handleCreateUser}
                loading={createUser.isPending}
            />

            <UserFormModal
                opened={!!editingUser}
                onClose={() => setEditingUser(null)}
                availableRoles={availableRoles}
                initialData={editingUser ?? undefined}
                onSubmit={handleUpdateRoles}
                loading={updateUserRoles.isPending}
                isEditMode={true}
            />
        </div>
    );
}
