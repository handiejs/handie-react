import {
  ListViewContext,
  SearchDescriptor,
  SearchContext,
  BaseWidgetState,
  SearchWidgetConfig,
  FilterWidgetConfig,
  IFilterWidget,
  isBoolean,
  isPlainObject,
} from '@handie/runtime-core';
import { FilterHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { BaseStructuralWidget } from '../base';

class FilterStructuralWidget<
  ValueType = any,
  CT extends FilterWidgetConfig = FilterWidgetConfig,
  HW extends FilterHeadlessWidget<ValueType, CT> = FilterHeadlessWidget<ValueType, CT>,
  S extends BaseWidgetState = BaseWidgetState
> extends BaseStructuralWidget<IFilterWidget<ValueType>, S, CT, HW, ListViewContext> {
  /**
   * Access the injected search context
   */
  protected get $$search(): SearchContext {
    return this.context.searchContext;
  }

  protected get showValidationRulesAsNative(): boolean {
    return this.$$_h.isValidationRulesShownAsNative();
  }

  protected get searchImmediately(): boolean {
    if (isBoolean(this.config.searchImmediately)) {
      return this.config.searchImmediately!;
    }

    const searchDescriptor = this.$$view.getSearch();

    if (isPlainObject(searchDescriptor)) {
      const { searchWhenSelectableFilterChange } =
        (searchDescriptor as SearchDescriptor<SearchWidgetConfig>).config || {};

      if (isBoolean(searchWhenSelectableFilterChange)) {
        return searchWhenSelectableFilterChange!;
      }
    }

    return this.getCommonBehavior('search.searchWhenSelectableFilterChange', false);
  }

  protected getPlaceholder(): string {
    return this.$$_h.getPlaceholder();
  }

  protected onChange(value: ValueType): void {
    this.props.onChange(value);
  }
}

export { FilterStructuralWidget };
