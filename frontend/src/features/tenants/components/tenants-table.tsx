import {Badge, Group, Paper} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {
    createSearchRequest,
    Column,
    TableData,
    RowAction,
    tableRenderers,
} from '@preboot.io/preboot-ui-community';
import {tenantsApi} from '@/features/tenants/api/tenants-service';
import {TenantResponse} from '@/generated/models/tenantResponse';
import {useNavigate} from 'react-router-dom';
import {TbUsers, TbEdit} from 'react-icons/tb';
import {StyledDataTable} from '@/components/styled/styled-data-table/styled-data-table.tsx';

interface TenantsTableProps {
    onEdit?: (tenant: TenantResponse) => void;
}

export function TenantsTable({onEdit}: TenantsTableProps) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [queryParams, setQueryParams] = useState(createSearchRequest(0, 10, 'name'));

    const {data, isLoading} = useQuery({
        queryKey: ['tenants', queryParams],
        queryFn: () => tenantsApi.searchTenants(queryParams),
    });

    const handleViewUsers = (tenant: TenantResponse) => {
        navigate(`/super-admin/tenants/${tenant.uuid}/users`);
    };

    const handleEditTenant = (tenant: TenantResponse) => {
        if (onEdit) {
            onEdit(tenant);
        }
    };

    const rowActions: RowAction<TenantResponse>[] = [
        {
            label: t('common.edit'),
            icon: TbEdit,
            onClick: handleEditTenant,
        },
        {
            label: t('features.tenants.actions.viewUsers'),
            icon: TbUsers,
            onClick: handleViewUsers,
        }
    ];

    const columns = [
        {
            key: 'name',
            label: t('features.tenants.fields.name'),
            sortable: true,
            filterable: true,
            filterType: 'text',
        } as Column<TenantResponse, 'name'>,
        {
            key: 'roles',
            label: t('features.tenants.fields.roles'),
            render: (values: string[]) => {
                const sortedValues = [...values].sort((a, b) => {
                    return a.localeCompare(b);
                });

                const displayValues = sortedValues.filter((value) => value !== 'DEMO');

                return (
                    <Group gap="xs" wrap="wrap">
                        {displayValues.map((value) => {
                            return (
                                <Badge
                                    key={value}
                                    color="blue"
                                    variant="light"
                                >
                                    {t(`features.tenants.roles.${value}`, {defaultValue: value})}
                                </Badge>
                            );
                        })}
                    </Group>
                );
            },
        } as Column<TenantResponse, 'roles'>,
        {
            key: 'active',
            label: t('common.status.label'),
            sortable: true,
            filterable: true,
            filterType: 'enum',
            filterOptions: [
                {label: t('common.status.active'), value: 'true'},
                {label: t('common.status.inactive'), value: 'false'},
            ],
            render: tableRenderers.boolean({
                activeLabel: t('common.status.active'),
                inactiveLabel: t('common.status.inactive'),
                activeColor: 'green',
                inactiveColor: 'red',
            }),
        } as Column<TenantResponse, 'active'>,
        {
            key: 'demo',
            label: t('auth.account.accountType'),
            sortable: true,
            filterable: false,
            filterType: 'enum',
            filterOptions: [
                {label: t('auth.account.demoAccount'), value: 'true'},
                {label: t('auth.account.paidAccount'), value: 'false'},
            ],
            render: tableRenderers.boolean({
                activeLabel: t('auth.account.demoAccount'),
                inactiveLabel: t('auth.account.paidAccount'),
                activeColor: 'red',
                inactiveColor: 'green',
            }),
        } as Column<TenantResponse, 'demo'>,
    ];

    return (
        <>
            <Paper p="md" shadow="sm">
                <StyledDataTable<TenantResponse>
                    data={data as TableData}
                    columns={columns}
                    loading={isLoading}
                    onParamsChange={setQueryParams}
                    currentParams={queryParams}
                    rowActions={rowActions}
                />
            </Paper>
        </>
    );
}
