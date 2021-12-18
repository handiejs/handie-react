import { ConfigType, ListViewContext, SearchContext, includes } from '@handie/runtime-core';
import { FilterDescriptor } from '@handie/runtime-core/dist/types/input';

import BaseHeadlessWidget from '../base/Base';

interface FilterWidgetProps<ValueType> {
  readonly filter: FilterDescriptor;
  readonly value: ValueType;
  readonly onChange: (value: ValueType) => void;
}

export default class FilterHeadlessWidget<
  ValueType = any,
  S extends Record<string, any> = {}
> extends BaseHeadlessWidget<FilterWidgetProps<ValueType>, S, ListViewContext> {
  /**
   * Access the injected search context
   */
  protected get $$search(): SearchContext {
    return this.context.searchContext;
  }

  protected get config(): ConfigType {
    return this.props.filter.config || {};
  }

  protected get showValidationRulesAsNative(): boolean {
    return this.getCommonBehavior('filter.showValidationRulesAsNative', false);
  }

  protected getPlaceholder(): string {
    let { showHintAsPlaceholder } = this.config;

    if (showHintAsPlaceholder === undefined) {
      showHintAsPlaceholder = this.getCommonBehavior('filter.showHintAsPlaceholder');
    }

    const { filter } = this.props;

    let defaultPlaceholder: string = '';

    if (filter.dataType) {
      defaultPlaceholder = `${
        includes(filter.dataType, ['string', 'text', 'int', 'float']) ? '请输入' : '请选择'
      }${filter.label || filter.name}`;
    }

    const placeholder = filter.placeholder || defaultPlaceholder;

    return showHintAsPlaceholder ? filter.hint || placeholder : placeholder;
  }

  protected onChange(value: ValueType): void {
    this.props.onChange(value);
  }
}
