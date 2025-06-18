import { useForm } from '@mantine/form';
import { TextInput, Button, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authService } from '../api/auth-service.ts';

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
    const { t } = useTranslation();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: {
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : t('common.errors.invalidEmail')),
        },
    });

    const resetPassword = useMutation({
        mutationFn: authService.requestPasswordReset,
        onSuccess: () => {
            setSuccessMessage(t('auth.forgotPassword.success'));
            form.reset();
        },
    });

    if (successMessage) {
        return (
            <Stack gap="md">
                <Text c="green" ta="center">{successMessage}</Text>
                <Button variant="subtle" onClick={onBack}>
                    {t('auth.forgotPassword.backToLogin')}
                </Button>
            </Stack>
        );
    }

    return (
        <form onSubmit={form.onSubmit((values) => resetPassword.mutate(values.email))}>
            <Stack gap="md">
                <Text size="sm">
                    {t('auth.forgotPassword.subtitle')}
                </Text>

                <TextInput
                    required
                    label={t('auth.login.email')}
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                />

                <Button
                    type="submit"
                    loading={resetPassword.isPending}
                    fullWidth
                >
                    {t('auth.forgotPassword.sendInstructions')}
                </Button>

                <Button variant="subtle" onClick={onBack}>
                    {t('auth.forgotPassword.backToLogin')}
                </Button>
            </Stack>
        </form>
    );
}
