import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Title, Stack, Alert } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { TbAlertCircle, TbCheck } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import {activationApi, ActivationError} from "@/features/auth/api/activation-service.ts";
import {ActivationForm} from "@/features/auth/components/activation-form.tsx";
import {ActivateAccountRequest} from "@/generated/models";

export function ActivateAccountPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const { mutate, isPending, isSuccess, isError, error } = useMutation({
        mutationFn: activationApi.activateAccount,
        onSuccess: () => {
            notifications.show({
                title: t('auth.activation.success.title'),
                message: t('auth.activation.success.message'),
                color: 'green',
                icon: <TbCheck size={20} />,
            });
            setTimeout(() => navigate('/login'), 2000);
        },
        onError: (error: ActivationError) => {
            let errorTitle = t('auth.activation.errors.serverError.title');
            let errorMessage = t('auth.activation.errors.serverError.message');

            if (error.status === 401) {
                const responseMessage = error.response?.data?.toString() ?? '';
                if (responseMessage.includes('already activated')) {
                    errorTitle = t('auth.activation.errors.alreadyActivated.title');
                    errorMessage = t('auth.activation.errors.alreadyActivated.message');
                } else {
                    errorTitle = t('auth.activation.errors.invalidToken.title');
                    errorMessage = t('auth.activation.errors.invalidToken.message');
                }
            }

            notifications.show({
                title: errorTitle,
                message: errorMessage,
                color: 'red',
                icon: <TbAlertCircle size={20} />,
            });
        }
    });

    useEffect(() => {
        if (!token) {
            notifications.show({
                title: t('auth.activation.errors.missingToken.title'),
                message: t('auth.activation.errors.missingToken.message'),
                color: 'red',
                icon: <TbAlertCircle size={20} />,
            });
            navigate('/login');
        }
    }, [token, navigate, t]);

    if (!token) {
        return null;
    }

    const handleSubmit = async (values: ActivateAccountRequest): Promise<void> => {
        return new Promise((resolve, reject) => {
            mutate(values, {
                onSuccess: () => resolve(),
                onError: (error) => reject(error)
            });
        });
    };

    return (
        <Container size="xs" py="xl">
            <Paper p="lg" radius="md" withBorder>
                <Stack gap="lg">
                    <Title order={2}>{t('auth.activation.title')}</Title>

                    {isError && error instanceof ActivationError && (
                        <Alert
                            color="red"
                            title={t('auth.activation.errors.serverError.title')}
                            icon={<TbAlertCircle size={20} />}
                        >
                            {error.message}
                        </Alert>
                    )}

                    {isSuccess ? (
                        <Alert
                            color="green"
                            title={t('auth.activation.success.title')}
                            icon={<TbCheck size={20} />}
                        >
                            {t('auth.activation.success.redirectMessage')}
                        </Alert>
                    ) : (
                        <ActivationForm
                            token={token}
                            onSubmit={handleSubmit}
                            loading={isPending}
                        />
                    )}
                </Stack>
            </Paper>
        </Container>
    );
}
