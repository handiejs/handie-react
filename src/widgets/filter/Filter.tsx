import { ListViewContext, SearchContext } from '@handie/runtime-core';
import {
  FilterWidgetConfig,
  IFilterWidget,
  FilterHeadlessWidget as _FilterHeadlessWidget,
} from '@handie/runtime-core/dist/widgets';

import BaseHeadlessWidget from '../base';

export default class FilterHeadlessWidget<
  ValueType = any,
  CT extends FilterWidgetConfig = FilterWidgetConfig,
  HW extends _FilterHeadlessWidget<ValueType, CT> = _FilterHeadlessWidget<ValueType, CT>,
  S extends Record<string, any> = {}
> extends BaseHeadlessWidget<IFilterWidget<ValueType>, S, CT, HW, ListViewContext> {
  /**
   * Access the injected search context
   */
  protected get $$search(): SearchContext {
    return this.context.searchContext;
  }

  protected get showValidationRulesAsNative(): boolean {
    return this.$$_h.isValidationRulesShownAsNative();
  }

  protected getPlaceholder(): string {
    return this.$$_h.getPlaceholder();
  }

  protected onChange(value: ValueType): void {
    this.props.onChange(value);
  }
}
