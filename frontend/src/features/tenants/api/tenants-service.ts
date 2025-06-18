import { SearchParams } from '@preboot.io/preboot-ui-community';
import { TenantResponse } from '@/generated/models/tenantResponse';
import { TenantUpdateRequest } from '@/generated/models/tenantUpdateRequest';
import { getSuperAdminTenantController } from '@models/super-admin-tenant-controller/super-admin-tenant-controller.ts';
import { CreateTenantRequest, PageTenantResponse } from '@/generated/models';

export const tenantsApi = {
    searchTenants: async (params: SearchParams): Promise<PageTenantResponse> => {
        return getSuperAdminTenantController().searchTenants(params);
    },

    getTenant: async (tenantId: string): Promise<TenantResponse> => {
        return getSuperAdminTenantController().getTenant(tenantId);
    },

    createTenant: async (tenantData: CreateTenantRequest): Promise<TenantResponse> => {
        return getSuperAdminTenantController().createTenant(tenantData);
    },

    updateTenant: async (
        tenantId: string,
        tenantData: TenantUpdateRequest
    ): Promise<TenantResponse> => {
        return getSuperAdminTenantController().updateTenant(tenantId, tenantData);
    },

    deleteTenant: async (tenantId: string): Promise<void> => {
        return getSuperAdminTenantController().deleteTenant(tenantId);
    },

    addRoleToTenant: async (tenantId: string, roleName: string): Promise<void> => {
        return getSuperAdminTenantController().addRoleToTenant(tenantId, roleName);
    },

    removeRoleFromTenant: async (tenantId: string, roleName: string): Promise<void> => {
        return getSuperAdminTenantController().removeRoleFromTenant(tenantId, roleName);
    },
};
