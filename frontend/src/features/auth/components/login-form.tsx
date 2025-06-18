import { useForm } from '@mantine/form';
import {TextInput, PasswordInput, Button, Stack, Text, Checkbox} from '@mantine/core';
import { useLogin } from '../hooks/use-login.ts';
import { useState, useEffect } from 'react';
import {useTranslation} from "react-i18next";
import {PasswordLoginRequest} from "@/generated/models";

interface LoginFormProps {
    onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
    const login = useLogin();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { t } = useTranslation();

    const form = useForm<PasswordLoginRequest>({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : t('common.errors.invalidEmail')),
            password: (value) => (value.length < 6 ? t('common.errors.passwordTooShort') : null),
        },
    });

    // Clear error message after 4 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    // Clear error message when email or password changes
    useEffect(() => {
        if (errorMessage) {
            setErrorMessage(null);
        }
    }, [form.values.email, form.values.password]);

    const handleSubmit = (values: PasswordLoginRequest) => {
        login.mutate(values, {
            onError: () => {
                setErrorMessage('Invalid email or password');
            }
        });
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
                <TextInput
                    required
                    label={t('auth.login.email')}
                    placeholder="your@email.com"
                    size="md"
                    {...form.getInputProps('email')}
                />

                <PasswordInput
                    required
                    label={t('auth.login.password')}
                    placeholder="Your password"
                    size="md"
                    {...form.getInputProps('password')}
                />

                <Checkbox
                    label={t('auth.login.rememberMe')}
                    {...form.getInputProps('rememberMe', { type: 'checkbox' })}
                />

                {errorMessage && (
                    <Text c="red" size="sm" ta="center">
                        {errorMessage}
                    </Text>
                )}

                <Button
                    type="submit"
                    loading={login.isPending}
                    fullWidth
                    size="md"
                >
                    {t('common.buttons.signIn')}
                </Button>
                <Button
                    variant="subtle"
                    onClick={onForgotPassword}
                    size="sm"
                    fullWidth
                >
                    {t('auth.login.forgotPassword')}
                </Button>
            </Stack>
        </form>
    );
}
