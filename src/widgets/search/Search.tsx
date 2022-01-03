import {
  EventHandlers,
  EventHandler,
  FilterDescriptor,
  SearchCondition,
  SearchContext,
  ListViewContext,
  SearchWidgetConfig,
  SearchWidgetState,
  ISearchWidget,
  isFunction,
} from '@handie/runtime-core';
import { SearchHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { getEventWithNamespace, resolveBindEvent } from '../../utils';
import { BaseStructuralWidget } from '../base';

class SearchStructuralWidget<
  CT extends SearchWidgetConfig = SearchWidgetConfig
> extends BaseStructuralWidget<
  ISearchWidget,
  SearchWidgetState,
  CT,
  SearchHeadlessWidget<CT>,
  ListViewContext
> {
  public readonly state = { condition: {} } as SearchWidgetState;

  protected get $$search(): SearchContext {
    return this.context.searchContext;
  }

  protected get filters(): FilterDescriptor[] {
    return this.$$search ? this.$$search.getFilters() : [];
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
    this.setHeadlessWidget(new SearchHeadlessWidget(this.props, this.$$view));

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

export { SearchStructuralWidget };
