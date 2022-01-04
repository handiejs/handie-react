import {
  ListValue,
  ListViewContext,
  SearchContext,
  ListViewWidgetConfig,
  ListViewWidgetState,
  isFunction,
  isEnumField,
  cacheDynamicEnumOptions,
  getCachedEnumOptions,
} from '@handie/runtime-core';
import {
  EnumFieldOptionGetter,
  EnumField,
  MultiEnumField,
} from '@handie/runtime-core/dist/types/input';
import { ListViewHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { getEventWithNamespace } from '../../utils';
import { ViewStructuralWidget } from './View';

class ListViewStructuralWidget<
  S extends ListViewWidgetState = ListViewWidgetState,
  CT extends ListViewWidgetConfig = ListViewWidgetConfig,
  VT extends ListValue = ListValue
> extends ViewStructuralWidget<ListViewContext<VT, CT>, S, CT, ListViewHeadlessWidget<CT>> {
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

  private loadListData(): void {
    const moduleName = this.$$module.getModuleName();
    const needCacheDynamicEnumFields = this.fields.filter(
      field =>
        isEnumField(field) &&
        isFunction((field as EnumField | MultiEnumField).options) &&
        !getCachedEnumOptions(moduleName, field),
    );

    // 有动态选项的枚举字段时先发相关 HTTP 请求并将结果缓存，
    // 以避免列表渲染时发出很多相关 HTTP 请求
    if (needCacheDynamicEnumFields.length > 0) {
      Promise.all(
        needCacheDynamicEnumFields.map(field =>
          ((field as EnumField | MultiEnumField).options as EnumFieldOptionGetter)(),
        ),
      ).then(results => {
        results.forEach((result, idx) => {
          if (result.success) {
            cacheDynamicEnumOptions(moduleName, needCacheDynamicEnumFields[idx], result.data);
          }
        });

        this.$$view.load();
      });
    } else {
      this.$$view.load();
    }
  }

  public componentWillMount(): void {
    super.componentWillMount();

    this.setHeadlessWidget(new ListViewHeadlessWidget(this.props, this.$$view));
    this.initPagenation();

    this.on({
      dataChange: dataSource => this.setState({ dataSource }),
      totalChange: total => this.setState({ total }),
      currentPageChange: pageNum => this.setState({ pageNum }),
      pageSizeChange: pageSize => this.setState({ pageSize }),
    });

    const searchContext = this.$$search;

    if (searchContext && !searchContext.isReady()) {
      searchContext.on(getEventWithNamespace(this, 'ready'), () => this.loadListData());
    } else {
      this.loadListData();
    }
  }

  public componentWillUnmount(): void {
    super.componentWillUnmount();

    const searchContext = this.$$search;

    if (searchContext) {
      searchContext.off(getEventWithNamespace(this, 'ready'));
    }
  }
}

export { ListViewStructuralWidget };
