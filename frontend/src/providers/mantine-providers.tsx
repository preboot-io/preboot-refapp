import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { shadcnTheme } from '@/theme/theme.ts';
import { MantineProvider } from '@mantine/core';
import { shadcnCssVariableResolver } from '@/theme/cssVariableResolver.ts';
import { DatesProvider } from '@mantine/dates';

import 'dayjs/locale/en';

export function MantineProviders({
                                     children
                                 }: {
    children: React.ReactNode
}) {
    return (
        <MantineProvider theme={shadcnTheme} defaultColorScheme="light" cssVariablesResolver={shadcnCssVariableResolver}>
            <Notifications position="top-right" zIndex={2000} />
            <DatesProvider settings={{locale: 'en', firstDayOfWeek: 1, weekendDays: [0, 6] }}>
                <ModalsProvider>{children}</ModalsProvider>
            </DatesProvider>
        </MantineProvider>
    );
}
