import {
  EventHandlers,
  EventHandler,
  ConfigType,
  FilterDescriptor,
  SearchDescriptor,
  SearchCondition,
  SearchContext,
  ListViewContext,
  SearchWidgetState,
  isFunction,
} from '@handie/runtime-core';

import { getEventWithNamespace, resolveBindEvent } from '../../utils';
import BaseHeadlessWidget from '../base/Base';

export default class SearchHeadlessWidget extends BaseHeadlessWidget<
  {},
  SearchWidgetState,
  ListViewContext
> {
  public readonly state = { condition: {} } as SearchWidgetState;

  protected get $$search(): SearchContext {
    return this.context.searchContext;
  }

  protected get filters(): FilterDescriptor[] {
    return this.$$search ? this.$$search.getFilters() : [];
  }

  protected get config(): ConfigType {
    return (this.$$view.getSearch() as SearchDescriptor).config || {};
  }

  protected on(event: string | EventHandlers, handler?: EventHandler): void {
    this.$$search.on(resolveBindEvent(this, event), handler);
  }

  protected off(event?: string, handler?: EventHandler): void {
    this.$$search.off(getEventWithNamespace(this, event), handler);
  }

  protected initCondition(condition: SearchCondition = {}): void {
    this.$$search.setValue({ ...this.state.condition, ...condition });
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

    this.setState({ condition });

    this.on({
      change: value => this.setState({ condition: { ...value } }),
      filterChange: ({ name, value }) =>
        this.setState({ condition: { ...this.state.condition, [name]: value } }),
    });
  }
}
