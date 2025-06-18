// src/pages/dashboard/dashboard-page.tsx
import { Title, Paper, SimpleGrid, Text, Box } from '@mantine/core';

export function DashboardPage() {
    return (
        <Box p="md">
            <Title order={1} mb="lg">Dashboard</Title>

            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing={{ base: 'sm', md: 'lg' }}>
                <Paper shadow="sm" p="md" radius="md">
                    <Text size="lg" fw={500} mb="xs">Total Users</Text>
                    <Text size="xl" fw={700}>1,234</Text>
                </Paper>

                <Paper shadow="sm" p="md" radius="md">
                    <Text size="lg" fw={500} mb="xs">Active Projects</Text>
                    <Text size="xl" fw={700}>42</Text>
                </Paper>

                <Paper shadow="sm" p="md" radius="md">
                    <Text size="lg" fw={500} mb="xs">Revenue</Text>
                    <Text size="xl" fw={700}>$45,678</Text>
                </Paper>

                <Paper shadow="sm" p="md" radius="md">
                    <Text size="lg" fw={500} mb="xs">Growth</Text>
                    <Text size="xl" fw={700}>+12.3%</Text>
                </Paper>
            </SimpleGrid>
        </Box>
    );
}
