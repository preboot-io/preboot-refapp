import { useForm } from '@mantine/form';
import { TextInput, Button, Stack, Text, Alert } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authService } from '../api/auth-service';
import { TbInfoCircle } from 'react-icons/tb';
import {useState} from "react";
import {isAxiosError} from "axios";

interface RegistrationFormValues {
    tenantName: string;
    username: string;
    email: string;
    language: string;
    timezone: string;
}

interface RegistrationFormProps {
    onBack: () => void;
}

export function RegistrationForm({ onBack }: RegistrationFormProps) {
    const { t } = useTranslation();
    const [success, setSuccess] = useState(false);

    const form = useForm<RegistrationFormValues>({
        initialValues: {
            tenantName: '',
            username: '',
            email: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language
        },
        validate: {
            tenantName: (value) => !value ? t('common.errors.required') : null,
            username: (value) => !value ? t('common.errors.required') : null,
            email: (value) => (/^\S+@\S+$/.test(value) ? null : t('common.errors.invalidEmail')),
        },
    });

    const register = useMutation({
        mutationFn: (values: RegistrationFormValues) => authService.register(values),
        onSuccess: () => {
            setSuccess(true);
        },
    });

    const getErrorMessage = (error: unknown) => {
        if (isAxiosError(error)) {
            if (error.response?.status === 403) {
                return t('auth.register.registrationDisabled');
            }
        }
        return t('common.errors.serverError');
    };

    if (success) {
        return (
            <Stack gap="md">
                <Alert
                    icon={<TbInfoCircle />}
                    title={t('auth.register.successTitle')}
                    color="green"
                >
                    {t('auth.register.successMessage')}
                </Alert>
                <Button variant="subtle" onClick={onBack}>
                    {t('auth.register.backToLogin')}
                </Button>
            </Stack>
        );
    }

    return (
        <form onSubmit={form.onSubmit((values) => register.mutate(values))}>
            <Stack gap="md">
                <TextInput
                    required
                    label={t('auth.register.organizationName')}
                    placeholder={t('auth.register.organizationNamePlaceholder')}
                    {...form.getInputProps('tenantName')}
                />

                <TextInput
                    required
                    label={t('auth.register.username')}
                    placeholder={t('auth.register.usernamePlaceholder')}
                    {...form.getInputProps('username')}
                />

                <TextInput
                    required
                    label={t('auth.register.email')}
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                />

                {register.isError && (
                    <Text c="red" size="sm" ta="center">
                        {getErrorMessage(register.error)}
                    </Text>
                )}

                <Button
                    type="submit"
                    loading={register.isPending}
                    fullWidth
                >
                    {t('auth.register.submit')}
                </Button>

                <Button variant="subtle" onClick={onBack}>
                    {t('auth.register.backToLogin')}
                </Button>
            </Stack>
        </form>
    );
}
