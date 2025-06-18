import { Container, Paper, Stack, Text, Title, Group, Button } from '@mantine/core';
import { LoginForm } from '@/features/auth/components/login-form';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { RegistrationForm } from '@/features/auth/components/registration-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '@/config/env';

type View = 'login' | 'forgotPassword' | 'register';

export function LoginPage() {
    const [currentView, setCurrentView] = useState<View>('login');
    const { t } = useTranslation();

    const getTitle = () => {
        switch (currentView) {
            case 'register':
                return t('auth.register.title');
            case 'forgotPassword':
                return t('auth.forgotPassword.title');
            default:
                return t('auth.login.title');
        }
    };

    const getSubtitle = () => {
        switch (currentView) {
            case 'register':
                return t('auth.register.subtitle');
            case 'forgotPassword':
                return t('auth.forgotPassword.subtitle');
            default:
                return t('auth.login.subtitle');
        }
    };

    return (
        <Container size="lg" py="xl">
            <Stack gap="lg">
                <Title ta="center" fw={900}>
                    {getTitle()}
                </Title>

                <Text c="dimmed" size="sm" ta="center">
                    {getSubtitle()}
                </Text>

                <Paper withBorder shadow="md" p="xl" radius="md">
                    {currentView === 'login' && (
                        <>
                            <LoginForm
                                onForgotPassword={() => setCurrentView('forgotPassword')}
                            />
                            {config.ENABLE_REGISTRATION && (
                                <Group justify="center" mt="md">
                                    <Button
                                        variant="subtle"
                                        onClick={() => setCurrentView('register')}
                                    >
                                        {t('auth.login.createAccount')}
                                    </Button>
                                </Group>
                            )}
                        </>
                    )}
                    {currentView === 'forgotPassword' && (
                        <ForgotPasswordForm
                            onBack={() => setCurrentView('login')}
                        />
                    )}
                    {currentView === 'register' && (
                        <RegistrationForm
                            onBack={() => setCurrentView('login')}
                        />
                    )}
                </Paper>
            </Stack>
        </Container>
    );
}
