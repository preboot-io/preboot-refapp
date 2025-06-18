import { useForm } from '@mantine/form';
import { Checkbox, Stack } from '@mantine/core';
import { TenantResponse } from '@/generated/models';
import { TenantFormValues } from '../types/tenant-form-types';
import { BaseForm, TextField } from '@preboot.io/preboot-ui-community';
import { useTranslation } from 'react-i18next';

interface TenantFormProps {
    initialData?: TenantResponse;
    onSubmit: (values: TenantFormValues) => Promise<void>;
    loading?: boolean;
}

export function TenantForm({ initialData, onSubmit, loading }: TenantFormProps) {
    const { t } = useTranslation();

    const form = useForm<TenantFormValues>({
        initialValues: {
            name: initialData?.name || '',
            active: initialData?.active ?? true,
            demo: initialData?.demo ?? true,
        },
        validate: {
            name: value => (!value ? t('features.tenants.validation.nameRequired') : null),
        },
    });

    return (
        <BaseForm
            form={form}
            onSubmit={onSubmit}
            loading={loading}
            submitLabel={initialData ? t('common.update') : t('common.create')}
        >
            <Stack gap="md">
                <TextField
                    form={form}
                    name="name"
                    label={t('features.tenants.fields.name')}
                    placeholder={t('features.tenants.placeholders.name')}
                    required
                />
                <Checkbox
                    {...form.getInputProps('active', { type: 'checkbox' })}
                    label={t('common.status.active')}
                />
                <Checkbox
                    {...form.getInputProps('demo', { type: 'checkbox' })}
                    label={t('auth.account.demoAccount')}
                />
            </Stack>
        </BaseForm>
    );
}
