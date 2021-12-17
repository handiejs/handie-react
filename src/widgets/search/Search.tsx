import {
  ConfigType,
  FilterDescriptor,
  SearchDescriptor,
  SearchCondition,
  SearchContext,
  ListViewContext,
  isFunction,
} from '@handie/runtime-core';

import BaseHeadlessWidget from '../base/Base';

export default class SearchHeadlessWidget extends BaseHeadlessWidget<{}, {}, ListViewContext> {
  protected get $$search(): SearchContext {
    return this.context.searchContext;
  }

  protected condition: SearchCondition = {};

  protected get filters(): FilterDescriptor[] {
    return this.$$search ? this.$$search.getFilters() : [];
  }

  protected get config(): ConfigType {
    return (this.$$view.getSearch() as SearchDescriptor).config || {};
  }

  protected initCondition(condition: SearchCondition = {}): void {
    this.$$search.setValue({ ...this.condition, ...condition });
  }

  protected setFilterValue(name: string, value: any): void {
    this.$$search.setFilterValue(name, value);
  }

  protected submit(): void {
    this.$$search.submit();
  }

  protected reset(): void {
    this.$$search.reset();
  }

  public componentWillMount(): void {
    let condition = this.$$search.getDefaultValue();

    // FIXME: 临时做法
    const searchInitialValue = (this.$$view.getSearch() as any).initialValue;

    if (searchInitialValue) {
      condition = {
        ...condition,
        ...(isFunction(searchInitialValue)
          ? searchInitialValue(this.$$view, this)
          : searchInitialValue),
      };
    }

    this.condition = condition;

    this.on({
      change: value => (this.condition = { ...value }),
      filterChange: ({ name, value }) => (this.condition[name] = value),
    });
  }
}
