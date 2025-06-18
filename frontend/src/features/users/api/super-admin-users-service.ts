import {PageUserAccountInfo} from '@/generated/models';
import {getSuperAdminUserController} from "@models/super-admin-user-controller/super-admin-user-controller.ts";
import {SearchParams} from "@preboot.io/preboot-ui-community";
import { CreateInactiveUserAccountRequest } from '@/generated/models/createInactiveUserAccountRequest';
import { UserAccountInfo } from '@/generated/models/userAccountInfo';

export const superAdminUsersApi = {

    getTenantUsers: async (tenantId: string, params: SearchParams): Promise<PageUserAccountInfo> => {
        return getSuperAdminUserController().getTenantUsers(tenantId, params);
    },

    searchAllUsers: async (params: SearchParams): Promise<PageUserAccountInfo> => {
        return getSuperAdminUserController().searchAllUsers(params);
    },

    createTenantUser: async (
        tenantId: string,
        userData: CreateInactiveUserAccountRequest
    ): Promise<UserAccountInfo> => {
        return getSuperAdminUserController().createUserForTenant(tenantId, userData);
    },
};
