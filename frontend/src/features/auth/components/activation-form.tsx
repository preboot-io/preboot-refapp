import { useForm } from '@mantine/form';
import { BaseForm, PasswordField } from "@preboot.io/preboot-ui-community";
import { Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {ActivateAccountRequest} from "@/generated/models";

interface ActivationFormProps {
    token: string;
    onSubmit: (values: ActivateAccountRequest) => Promise<void>;
    loading?: boolean;
}

interface FormValues {
    password: string;
    confirmPassword: string;
}

export function ActivationForm({ token, onSubmit, loading }: ActivationFormProps) {
    const { t } = useTranslation();

    const form = useForm<FormValues>({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: {
            password: (value) => {
                if (!value) return t('common.errors.required');
                if (value.length < 8) return t('auth.activation.password.requirements');
                return null;
            },
            confirmPassword: (value, values) =>
                value !== values.password ? t('auth.activation.confirmPassword.mismatch') : null,
        },
    });

    const handleSubmit = async (values: FormValues) => {
        await onSubmit({
            token,
            password: values.password,
        });
    };

    return (
        <BaseForm
            form={form}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel={t('auth.activation.submit')}
        >
            <Stack gap="md">
                <Text size="sm" c="dimmed">
                    {t('auth.activation.subtitle')}
                </Text>

                <PasswordField<FormValues>
                    form={form}
                    name="password"
                    label={t('auth.activation.password.label')}
                    placeholder={t('auth.activation.password.placeholder')}
                />

                <PasswordField<FormValues>
                    form={form}
                    name="confirmPassword"
                    label={t('auth.activation.confirmPassword.label')}
                    placeholder={t('auth.activation.confirmPassword.placeholder')}
                />
            </Stack>
        </BaseForm>
    );
}
