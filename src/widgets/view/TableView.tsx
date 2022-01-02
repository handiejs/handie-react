import { ReactNode } from 'react';

import {
  ClientAction,
  isFunction,
  isEnumField,
  getControl,
  getRenderer,
  getBehaviorByKey,
  cacheDynamicEnumOptions,
  getCachedEnumOptions,
} from '@handie/runtime-core';
import {
  EnumFieldOptionGetter,
  EnumField,
  MultiEnumField,
} from '@handie/runtime-core/dist/types/input';
import {
  TableViewWidgetConfig,
  ListViewWidgetState,
  ListViewHeadlessWidget as _ListViewHeadlessWidget,
} from '@handie/runtime-core/dist/widgets';

import { ComponentCtor } from '../../types/component';
import { getEventWithNamespace } from '../../utils';

import { DataTableProps } from './typing';
import { resolveTopActions, resolveTableProps } from './helper';
import defaultBehaviors from './behavior';
import ListViewHeadlessWidget from './ListView';

export default class TableViewHeadlessWidget<
  S extends ListViewWidgetState = ListViewWidgetState,
  CT extends TableViewWidgetConfig = TableViewWidgetConfig
> extends ListViewHeadlessWidget<S, CT> {
  private tableProps: DataTableProps = {} as any;

  protected get searchable(): boolean {
    return !!this.$$view.getSearch();
  }

  protected get accessible(): Record<string, boolean> | null {
    return {};
  }

  protected get topActions(): ClientAction[] {
    return resolveTopActions(this.$$view, this.accessible, this);
  }

  protected renderSearch(): ReactNode {
    const SearchRenderer = getRenderer('SearchRenderer') as ComponentCtor;

    return this.searchable ? (
      <div
        className={this.getStyleClassName('TableView-search')}
        key='SearchOfTableViewHeadlessWidget'
      >
        {SearchRenderer ? <SearchRenderer /> : null}
      </div>
    ) : null;
  }

  protected renderActionBar(): ReactNode {
    return this.topActions.length > 0 ? (
      <div
        className={this.getStyleClassName('TableView-tableActions')}
        key='ActionBarOfTableViewHeadlessWidget'
      >
        {this.topActions.map(({ config = {}, ...others }) => {
          const ActionRenderer = getRenderer('ActionRenderer') as ComponentCtor;

          return ActionRenderer ? (
            <ActionRenderer
              key={others.name || others.text}
              action={{
                ...others,
                config: { size: this.getBehavior('topButtonActionSize'), ...config },
              }}
            />
          ) : null;
        })}
      </div>
    ) : null;
  }

  protected renderDataTable(): ReactNode {
    const DataTable = getControl('DataTable') as ComponentCtor<Record<string, any>>;
    const state = this.state as Record<string, any>;

    return (
      <DataTable
        key='DataTableOfTableViewHeadlessWidget'
        {...this.tableProps}
        className={this.getStyleClassName('TableView-dataTable')}
        dataSource={state.dataSource}
        currentPage={state.pageNum}
        pageSize={state.pageSize}
        total={state.total}
        pageSizes={this.config.pageSizes || getBehaviorByKey('common.view.listViewPageSizes')}
        loading={state.loading}
        onSelectionChange={selected => this.$$view.setValue(selected)}
        onCurrentChange={currentPage => this.$$view.setCurrentPage(currentPage)}
        onSizeChange={pageSize => this.$$view.setPageSize(pageSize)}
      />
    );
  }

  private loadTableData(): void {
    const moduleName = this.$$module.getModuleName();
    const needCacheDynamicEnumFields = this.fields.filter(
      field =>
        isEnumField(field) &&
        isFunction((field as EnumField | MultiEnumField).options) &&
        !getCachedEnumOptions(moduleName, field),
    );

    // 有动态选项的枚举字段时先发相关 HTTP 请求并将结果缓存，
    // 以避免表格渲染时发出很多相关 HTTP 请求
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

    this.tableProps = resolveTableProps(
      this.$$view,
      this.accessible,
      this,
      this.getBehavior('inlineButtonActionSize'),
    );

    const searchContext = this.$$search;

    if (searchContext && !searchContext.isReady()) {
      searchContext.on(getEventWithNamespace(this, 'ready'), () => this.loadTableData());
    } else {
      this.loadTableData();
    }
  }

  public componentWillUnmount(): void {
    super.componentWillMount();

    const searchContext = this.$$search;

    if (searchContext) {
      searchContext.off(getEventWithNamespace(this, 'ready'));
    }
  }
}
