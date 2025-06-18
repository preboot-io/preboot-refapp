import { Container, Paper, Title, Text, Stack, PasswordInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authService } from '@/features/auth/api/auth-service.ts';

interface PasswordValues {
    newPassword: string,
    confirmPassword: string,
}

export function ResetPasswordPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [success, setSuccess] = useState(false);

    const form = useForm({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validate: {
            newPassword: (value: string) =>
                value.length < 6 ? t('common.errors.passwordTooShort') : null,
            confirmPassword: (value: string, values: PasswordValues) =>
                value !== values.newPassword ? t('auth.resetPassword.passwordMismatch') : null,
        },
    });

    const resetPassword = useMutation({
        mutationFn: authService.resetPassword,
        onSuccess: () => {
            setSuccess(true);
        },
    });

    if (!token) {
        return (
            <Container size="xs" py="xl">
                <Paper withBorder shadow="md" p="xl" radius="md">
                    <Text c="red" ta="center">
                        {t('auth.resetPassword.invalidLink')}
                    </Text>
                    <Button
                        onClick={() => navigate('/login')}
                        variant="subtle"
                        fullWidth
                        mt="md"
                    >
                        {t('auth.resetPassword.goToLogin')}
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (success) {
        return (
            <Container size="xs" py="xl">
                <Paper withBorder shadow="md" p="xl" radius="md">
                    <Stack gap="md">
                        <Text c="green" ta="center">
                            {t('auth.resetPassword.success')}
                        </Text>
                        <Button onClick={() => navigate('/login')} fullWidth>
                            {t('auth.resetPassword.goToLogin')}
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="xs" py="xl">
            <Stack gap="lg">
                <Title ta="center" fw={900}>
                    {t('auth.resetPassword.title')}
                </Title>
                <Text c="dimmed" size="sm" ta="center">
                    {t('auth.resetPassword.subtitle')}
                </Text>

                <Paper withBorder shadow="md" p="xl" radius="md">
                    <form onSubmit={form.onSubmit((values) =>
                        resetPassword.mutate({ token, newPassword: values.newPassword })
                    )}>
                        <Stack gap="md">
                            <PasswordInput
                                required
                                label={t('auth.resetPassword.newPassword')}
                                {...form.getInputProps('newPassword')}
                            />

                            <PasswordInput
                                required
                                label={t('auth.resetPassword.confirmPassword')}
                                {...form.getInputProps('confirmPassword')}
                            />

                            {resetPassword.isError && (
                                <Text c="red" size="sm" ta="center">
                                    {t('common.errors.serverError')}
                                </Text>
                            )}

                            <Button
                                type="submit"
                                loading={resetPassword.isPending}
                                fullWidth
                            >
                                {t('common.buttons.submit')}
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Stack>
        </Container>
    );
}
