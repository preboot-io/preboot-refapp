import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from "axios";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                // Retry up to 3 times if it's a 401 error (token might be refreshing)
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    return failureCount < 3;
                }
                return false; // Don't retry other errors
            },
            retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 30000),
        },
    },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
