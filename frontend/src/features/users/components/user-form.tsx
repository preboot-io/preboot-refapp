import { useForm } from '@mantine/form';
import { TextInput, Button, Stack, MultiSelect, Group } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserAccountInfo } from '@/generated/models';

// Interface for the form values
export interface UserFormValues {
    username: string;
    email: string;
    roles: string[];
    language?: string;
    timezone?: string;
}

interface UserFormProps {
    initialData?: UserAccountInfo;
    availableRoles: string[];
    onSubmit: (values: UserFormValues) => Promise<void>;
    loading?: boolean;
    isEditMode?: boolean;
}

export function UserForm({
                             initialData,
                             availableRoles,
                             onSubmit,
                             loading = false,
                             isEditMode = false
                         }: UserFormProps) {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<UserFormValues>({
        initialValues: {
            username: initialData?.username || '',
            email: initialData?.email || '',
            roles: initialData?.roles || [],
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        validate: {
            username: (value) => !value ? t('features.users.form.errors.usernameRequired') : null,
            email: (value) => (/^\S+@\S+$/.test(value) ? null : t('common.errors.invalidEmail')),
            roles: (value) => value.length === 0 ? t('features.users.form.errors.rolesRequired') : null,
        },
    });

    const handleSubmit = async (values: UserFormValues) => {
        try {
            setError(null);
            await onSubmit(values);
            if (!isEditMode) {
                form.reset();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.errors.serverError'));
        }
    };

    const translatedRoleOptions = availableRoles.map(role => ({
        value: role,
        label: t(`features.users.roles.${role}`, role)
    }));

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
                <TextInput
                    withAsterisk
                    label={t('features.users.form.username')}
                    placeholder={t('features.users.form.usernamePlaceholder')}
                    {...form.getInputProps('username')}
                    disabled={isEditMode}
                />

                <TextInput
                    withAsterisk
                    label={t('features.users.form.email')}
                    placeholder={t('features.users.form.emailPlaceholder')}
                    {...form.getInputProps('email')}
                    disabled={isEditMode}
                />

                <MultiSelect
                    withAsterisk
                    data={translatedRoleOptions}
                    label={t('features.users.form.roles')}
                    placeholder={t('features.users.form.rolesPlaceholder')}
                    {...form.getInputProps('roles')}
                />

                {error && (
                    <div style={{ color: 'red', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <Group justify="flex-end" mt="md">
                    <Button type="submit" loading={loading}>
                        {isEditMode ? t('common.buttons.update') : t('common.buttons.create')}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
