import { Modal } from '@mantine/core';
import { UserForm, UserFormValues } from './user-form';
import { UserAccountInfo } from '@/generated/models';
import { useTranslation } from 'react-i18next';

interface UserFormModalProps {
    opened: boolean;
    onClose: () => void;
    availableRoles: string[];
    onSubmit: (values: UserFormValues) => Promise<void>;
    loading?: boolean;
    initialData?: UserAccountInfo;
    isEditMode?: boolean;
}

export function UserFormModal({
                                  opened,
                                  onClose,
                                  availableRoles,
                                  onSubmit,
                                  loading = false,
                                  initialData,
                                  isEditMode = false,
                              }: UserFormModalProps) {
    const { t } = useTranslation();

    const handleSubmit = async (values: UserFormValues) => {
        await onSubmit(values);
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isEditMode ? t('features.users.modal.editTitle') : t('features.users.modal.createTitle')}
            size="md"
        >
            <UserForm
                initialData={initialData}
                availableRoles={availableRoles}
                onSubmit={handleSubmit}
                loading={loading}
                isEditMode={isEditMode}
            />
        </Modal>
    );
}
