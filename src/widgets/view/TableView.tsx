import { getControl, getBehaviorByKey } from '@handie/runtime-core';
import { ReactNode, JSXElementConstructor } from 'react';

import { getEventWithNamespace } from '../../utils';
import { DataTableProps } from './typing';
import ListViewHeadlessWidget from './ListView';
import defaultBehaviors from './behavior';

export default class TableViewHeadlessWidget extends ListViewHeadlessWidget {
  private tableProps: DataTableProps = {} as any;

  protected get searchable(): boolean {
    return !!this.$$view.getSearch();
  }

  protected get accessible(): Record<string, boolean> | null {
    return null;
  }

  private loadTableData(): void {
    this.$$view.load();
  }

  protected renderDataTable(): ReactNode {
    const DataTable = getControl('DataTable') as JSXElementConstructor<Record<string, any>>;
    const state = this.state as Record<string, any>;

    return (
      <DataTable
        { ...this.tableProps }
        className="TableView-dataTable"
        dataSource={ state.dataSource }
        currentPage={ state.pageNum }
        pageSize={ state.pageSize }
        total={ state.total }
        pageSizes={ this.config.pageSizes || getBehaviorByKey('common.view.listViewPageSizes') }
        loading={ state.loading }
        onSelectionChange={ selected => this.$$view.setValue(selected) }
        onCurrentChange={ currentPage => this.$$view.setCurrentPage(currentPage) }
        onSizeChange={ pageSize => this.$$view.setPageSize(pageSize) }
      />
    );
  }

  constructor(props: Record<string, any>) {
    super(props);

    this.setBehaviors('view.table', defaultBehaviors);
  }

  public componentWillMount(): void {
    super.componentWillMount();

    const searchContext = this.$$view.getSearchContext();

    if (searchContext && !searchContext.isReady()) {
      searchContext.on(getEventWithNamespace(this, 'ready'), this.loadTableData);
    } else {
      this.loadTableData();
    }
  }

  public componentWillUnmount(): void {
    super.componentWillMount();

    const searchContext = this.$$view.getSearchContext();

    if (searchContext) {
      searchContext.off(getEventWithNamespace(this, 'ready'));
    }
  }
}
