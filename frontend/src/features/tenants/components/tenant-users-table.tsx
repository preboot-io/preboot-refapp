import { Paper } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
    createSearchRequest,
    Column,
    tableRenderers,
    TableData,
} from '@preboot.io/preboot-ui-community';
import { UserAccountInfo } from '@/generated/models/userAccountInfo';
import { useParams } from 'react-router-dom';
import { StyledDataTable } from '@/components/styled/styled-data-table/styled-data-table.tsx';
import {superAdminUsersApi} from "@/features/users/api/super-admin-users-service.ts";
import {usersApi} from "@/features/users/api/users-service.ts";

interface TenantUsersTableProps {
    isSuperAdmin?: boolean;
}

export function TenantUsersTable({ isSuperAdmin = false }: TenantUsersTableProps) {
    const { t } = useTranslation();
    const { tenantId } = useParams<{ tenantId: string }>();

    const [queryParams, setQueryParams] = useState(createSearchRequest(0, 10, 'username'));

    const { data, isLoading } = useQuery({
        queryKey: ['tenant-users', queryParams, tenantId],
        queryFn: () => {
            if (isSuperAdmin && tenantId) {
                return superAdminUsersApi.getTenantUsers(tenantId, queryParams);
            }
            return usersApi.searchUsers(queryParams);
        },
    });

    const columns = [
        {
            key: 'username',
            label: t('features.users.fields.username'),
            sortable: true,
        } as Column<UserAccountInfo, 'username'>,
        {
            key: 'email',
            label: t('features.users.fields.email'),
            sortable: true,
        } as Column<UserAccountInfo, 'email'>,
        {
            key: 'active',
            label: t('features.users.fields.status'),
            sortable: true,
            render: tableRenderers.boolean({
                activeLabel: t('features.users.status.active'),
                inactiveLabel: t('features.users.status.inactive'),
                activeColor: 'green',
                inactiveColor: 'red',
            }),
        } as Column<UserAccountInfo, 'active'>,
        {
            key: 'roles',
            label: t('features.users.fields.roles'),
            render: tableRenderers.stringArray({
                color: 'blue',
                variant: 'light',
            }),
        } as Column<UserAccountInfo, 'roles'>,
    ];

    return (
        <Paper p="md" shadow="sm">
            <StyledDataTable<UserAccountInfo>
                data={data as TableData}
                columns={columns}
                loading={isLoading}
                onParamsChange={setQueryParams}
                currentParams={queryParams}
            />
        </Paper>
    );
}
