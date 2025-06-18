import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import { config } from '../config/env';
import { notifications } from '@mantine/notifications';

// Create event for session expiration
const SESSION_EXPIRED_EVENT = 'sessionExpired';
export const sessionExpiredEvent = new CustomEvent(SESSION_EXPIRED_EVENT);

export interface ApiError {
    status: number;
    error: string;
    message: string;
    path: string;
    timestamp: string;
    uuid: string;
}

// Create the axios instance
const instance = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError<ApiError>) => {
        const notification = {
            title: 'Error',
            message: 'An unexpected error occurred',
            color: 'red' as const
        };

        if (error.response) {
            switch (error.response.status) {
                case 401: {
                    localStorage.removeItem('token');
                    window.dispatchEvent(sessionExpiredEvent);
                    // @ts-ignore
                    if(error.response.data !== 'Invalid credentials') {
                        notification.message = 'Session expired, please login again';
                        notifications.show(notification);
                    }
                    break;
                }
                case 403: {
                    notification.message = 'You don\'t have permission to perform this action';
                    notifications.show(notification);
                    break;
                }
                case 404: {
                    notification.message = 'Resource not found';
                    notifications.show(notification);
                    break;
                }
                case 500: {
                    const apiError = error.response.data;
                    notification.message = `An unexpected error occurred. If the problem persists, contact support with this reference: ${apiError.uuid}`;
                    notifications.show(notification);
                    break;
                }
            }
        } else if (error.request) {
            notification.message = 'Unable to connect to the server. Please check your internet connection.';
            notifications.show(notification);
        }

        return Promise.reject(error.response?.data || error);
    }
);

// Export the function that Orval expects
export const axiosInstanceFunc = <T>(config: AxiosRequestConfig): Promise<T> => {
    return instance.request(config);
};

// Export the instance for other uses in your app
export const axiosInstance = instance;
