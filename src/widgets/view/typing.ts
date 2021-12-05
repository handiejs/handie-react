import { TableColumn } from '@handie/runtime-core';

type DataTableProps = { columns: TableColumn[]; hidePagination?: boolean };

interface TableViewWidgetBehaviors {
  topButtonActionSize?: 'large' | 'medium' | 'small';
  inlineButtonActionSize?: 'large' | 'medium' | 'small';
}

export { DataTableProps, TableViewWidgetBehaviors };
