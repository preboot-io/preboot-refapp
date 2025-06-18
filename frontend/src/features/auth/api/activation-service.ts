import {AxiosError} from 'axios';
import {ActivateAccountRequest} from "@/generated/models";
import {getAccountActivationController} from "@models/account-activation-controller/account-activation-controller.ts";

export interface ApiErrorResponse {
    status: number;
    data?: string;
}

export class ActivationError extends Error {
    constructor(
        message: string,
        public status?: number,
        public response?: ApiErrorResponse
    ) {
        super(message);
        this.name = 'ActivationError';
    }
}

export const activationApi = {
    activateAccount: async (data: ActivateAccountRequest): Promise<void> => {
        try {
            return await getAccountActivationController().activateAccount(data);
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new ActivationError(
                    error.message,
                    error.response?.status,
                    error.response?.data as ApiErrorResponse
                );
            }
            throw error;
        }
    },
};
