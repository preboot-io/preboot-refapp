import { Modal } from '@mantine/core';
import { TenantResponse } from '@/generated/models';
import { TenantForm } from './tenant-form';
import { useTranslation } from 'react-i18next';
import { TenantFormValues } from '@/features/tenants/types/tenant-form-types.ts';

interface TenantFormModalProps {
    opened: boolean;
    onClose: () => void;
    initialData?: TenantResponse;
    onSubmit: (values: TenantFormValues) => Promise<void>;
    loading?: boolean;
}

export function TenantFormModal({
    opened,
    onClose,
    initialData,
    onSubmit,
    loading = false,
}: TenantFormModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                initialData ? t('features.tenants.editTenant') : t('features.tenants.createTenant')
            }
            size="md"
        >
            <TenantForm initialData={initialData} onSubmit={onSubmit} loading={loading} />
        </Modal>
    );
}
