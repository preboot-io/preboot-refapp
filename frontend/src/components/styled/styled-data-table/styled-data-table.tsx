import { DataTable, DataTableProps } from '@preboot.io/preboot-ui-community';
import styles from './styled-data-table.module.css';
import {useTranslation} from "react-i18next";

export function StyledDataTable<T>({...props}: DataTableProps<T>) {
    const { t } = useTranslation();
    return (
        <DataTable
            {...props}
            containerClassName={styles.container}
            tableClassName={styles.table}
            translations={ {
                booleanFalse: t('common.no'),
                booleanTrue: t('common.yes'),
                addFilter:  t('common.dataTable.addFilter'),
                noRecordsFound:  t('common.dataTable.noRecordsFound'),
                totalItems:  t('common.dataTable.totalItems'),
                export:  t('common.dataTable.export'),
                exportAs:  t('common.dataTable.exportAs'),
                ...props.translations }}
        />
    )
}
