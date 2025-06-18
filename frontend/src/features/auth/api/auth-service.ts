import {
    AuthResponse,
    PasswordLoginRequest,
    ResetPasswordRequest,
    TenantInfo,
    UserAccountInfo
} from "@/generated/models";
import {getAuthController} from "@/generated/api/auth-controller/auth-controller.ts";
import {getPasswordResetController} from "@models/password-reset-controller/password-reset-controller.ts";
import {getRegistrationController} from "@models/registration-controller/registration-controller.ts";

export const authService = {
    login: async (credentials: PasswordLoginRequest): Promise<AuthResponse> => {
        return getAuthController().login(credentials);// axiosInstance.post('/api/auth/login', credentials);
    },

    getCurrentUser: async (): Promise<UserAccountInfo> => {
        return getAuthController().getCurrentUserAccount();
    },

    refreshToken: async (): Promise<AuthResponse> => {
        return getAuthController().refresh();
    },

    requestPasswordReset: async (email: string) => {
        return getPasswordResetController().requestReset({email});
    },

    resetPassword: async (request: ResetPasswordRequest) => {
        return getPasswordResetController().resetPassword(request);
    },

    register: async (data: {
        tenantName: string;
        username: string;
        email: string;
        timezone: string;
        language: string;
    }): Promise<void> => {
        return getRegistrationController().register(data);
    },

    getCurrentUserTenants: async (): Promise<TenantInfo[]> => {
        return getAuthController().getCurrentUserTenants();
    },

    switchTenant: async (tenantId: string): Promise<AuthResponse> => {
        return getAuthController().setCurrentUserTenant({tenantId});
    },
};
