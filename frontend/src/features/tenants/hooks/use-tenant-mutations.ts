import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TenantFormValues } from '@/features/tenants/types/tenant-form-types.ts';
import { tenantsApi } from '@/features/tenants/api/tenants-service.ts';
import { showNotification } from '@mantine/notifications';
import { CreateTenantRequest, TenantUpdateRequest } from '@/generated/models';

export function useCreateTenant() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (data: TenantFormValues) => {
            const createRequest: CreateTenantRequest = {
                name: data.name,
                active: data.active
            };
            return tenantsApi.createTenant(createRequest);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            showNotification({
                title: t('common.success'),
                message: t('features.tenants.createSuccess'),
                color: 'green'
            });
        },
        onError: () => {
            showNotification({
                title: t('common.error'),
                message: t('features.tenants.createError'),
                color: 'red'
            });
        }
    });
}

export function useUpdateTenant() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: ({ tenantId, data }: { tenantId: string; data: TenantFormValues }) => {
            const updateRequest: TenantUpdateRequest = {
                ...data,
                tenantId: tenantId
            };
            if(data.demo) {
                return tenantsApi.addRoleToTenant(tenantId, 'DEMO').then(_ => tenantsApi.updateTenant(tenantId, updateRequest));
            }
            return tenantsApi.removeRoleFromTenant(tenantId, 'DEMO').then(_ => tenantsApi.updateTenant(tenantId, updateRequest));
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            queryClient.invalidateQueries({ queryKey: ['tenant', variables.tenantId] });
            showNotification({
                title: t('common.success'),
                message: t('features.tenants.updateSuccess'),
                color: 'green'
            });
        },
        onError: () => {
            showNotification({
                title: t('common.error'),
                message: t('features.tenants.updateError'),
                color: 'red'
            });
        }
    });
}
