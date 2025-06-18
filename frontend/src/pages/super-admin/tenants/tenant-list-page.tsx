import {useState} from 'react';
import {Box, Button, Group, Title} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {TbPlus} from 'react-icons/tb';
import {TenantsTable} from '@/features/tenants/components/tenants-table';
import {TenantFormModal} from '@/features/tenants/components/tenant-form-modal';
import {TenantFormValues} from '@/features/tenants/types/tenant-form-types';
import {useCreateTenant, useUpdateTenant} from '@/features/tenants/hooks/use-tenant-mutations.ts';
import {TenantResponse} from '@/generated/models';

export function TenantListPage() {
    const {t} = useTranslation();
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<TenantResponse | null>(null);

    const createMutation = useCreateTenant();
    const updateMutation = useUpdateTenant();

    const handleOpenCreateModal = () => {
        setSelectedTenant(null);
        setFormModalOpen(true);
    };

    const handleOpenEditModal = (tenant: TenantResponse) => {
        setSelectedTenant(tenant);
        setFormModalOpen(true);
    };

    const handleSubmit = async (values: TenantFormValues) => {
        if (selectedTenant && selectedTenant.uuid) {
            await updateMutation.mutateAsync({
                tenantId: selectedTenant.uuid,
                data: values
            });
        } else {
            await createMutation.mutateAsync(values);
        }
        setFormModalOpen(false);
    };

    return (
        <Box p="md">
            <Group justify="space-between" mb="lg">
                <Title order={2}>{t('features.tenants.title')}</Title>
                <Button
                    leftSection={<TbPlus/>}
                    onClick={handleOpenCreateModal}
                >
                    {t('features.tenants.createTenant')}
                </Button>
            </Group>

            <TenantsTable onEdit={handleOpenEditModal}/>

            <TenantFormModal
                opened={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                initialData={selectedTenant as TenantResponse}
                onSubmit={handleSubmit}
                loading={createMutation.isPending || updateMutation.isPending}
            />
        </Box>
    );
}
