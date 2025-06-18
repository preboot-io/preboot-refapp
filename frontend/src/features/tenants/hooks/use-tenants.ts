import { SearchParams } from '@preboot.io/preboot-ui-community';
import { useQuery } from '@tanstack/react-query';
import { tenantsApi } from '@/features/tenants/api/tenants-service.ts';

export function useTenants(params: SearchParams) {
    return useQuery({
        queryKey: ['tenants', params],
        queryFn: () => tenantsApi.searchTenants(params),
    });
}
