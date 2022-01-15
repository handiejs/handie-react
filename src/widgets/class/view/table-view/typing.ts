import { TableColumn } from '@handie/runtime-core';

type DataTableProps = { columns: TableColumn[]; hidePagination?: boolean };

type ButtonSize = 'large' | 'medium' | 'small';

interface TableViewWidgetBehaviors {
  readonly topButtonActionSize?: ButtonSize;
  readonly inlineButtonActionSize?: ButtonSize;
}

export { DataTableProps, TableViewWidgetBehaviors };
