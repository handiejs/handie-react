import { ListValue, ListViewContext, SearchContext } from '@handie/runtime-core';
import {
  ListViewWidgetConfig,
  ListViewWidgetState,
  ListViewHeadlessWidget as _ListViewHeadlessWidget,
} from '@handie/runtime-core/dist/widgets';

import ViewHeadlessWidget from './View';

export default class ListViewHeadlessWidget<
  S extends ListViewWidgetState = ListViewWidgetState,
  CT extends ListViewWidgetConfig = ListViewWidgetConfig,
  VT extends ListValue = ListValue
> extends ViewHeadlessWidget<ListViewContext<VT, CT>, S, CT, _ListViewHeadlessWidget<CT>> {
  public readonly state = {
    loading: false,
    dataSource: [],
    pageNum: 1,
    pageSize: 20,
    total: 0,
  } as any;

  /**
   * Access the injected search context
   */
  protected get $$search(): SearchContext {
    return this.context.searchContext;
  }

  private initPagenation(): void {
    const defaultPageSize = this.$$_h.getDefaultPageSize();

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
