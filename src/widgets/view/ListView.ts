import { ListViewContext, SearchContext, getBehaviorByKey } from '@handie/runtime-core';

import ViewHeadlessWidget, { ViewWidgetState } from './View';

interface ListViewWidgetState extends ViewWidgetState {
  dataSource: Record<string, any>[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export default class ListViewHeadlessWidget extends ViewHeadlessWidget<
  ListViewContext,
  ListViewWidgetState
> {
  public readonly state = {
    loading: false,
    dataSource: [],
    pageNum: 1,
    pageSize: 20,
    total: 0,
  };

  /**
   * Access the injected search context
   */
  protected get $$search(): SearchContext {
    return this.context.searchContext;
  }

  private initPagenation(): void {
    const defaultPageSize =
      this.config.defaultPageSize || getBehaviorByKey('common.view.listViewDefaultPageSize', 20);

    this.setState({ pageSize: defaultPageSize });

    this.$$view.setCurrentPage(this.state.pageNum, true);
    this.$$view.setPageSize(defaultPageSize, true);
  }

  public componentWillMount(): void {
    super.componentWillMount();

    this.initPagenation();

    this.on({
      dataChange: dataSource => this.setState({ dataSource }),
      totalChange: total => this.setState({ total }),
      currentPageChange: pageNum => this.setState({ pageNum }),
      pageSizeChange: pageSize => this.setState({ pageSize }),
    });
  }
}
