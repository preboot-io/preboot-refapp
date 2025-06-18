import { defineConfig } from 'orval';

export default defineConfig({
    api: {
        input: 'http://localhost:8080/api/v3/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/generated/api',
            client: 'axios',
            clean: true,
            schemas: 'src/generated/models',
            mock: false,
            headers: true,
            override: {
                mutator: {
                    path: './src/utils/axios.ts',
                    name: 'axiosInstanceFunc',
                },
                operationName: (operation: any, route: any) => {
                    // Get the first tag as the controller name
                    const tag = route.tags?.[0]?.replace(/\s+/g, '') || '';

                    // Get the original operation ID
                    const operationId = operation.operationId;

                    // Remove numeric suffixes if present
                    const baseOperation = operationId?.replace(/\_\d+$/, '');

                    // Combine operation with controller name
                    return `${baseOperation}${tag}`;
                }
            },
        },
    },
});
