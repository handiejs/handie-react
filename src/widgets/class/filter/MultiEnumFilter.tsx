import { EnumFilterWidgetState, EnumFilterWidgetConfig } from '@handie/runtime-core';

import { BaseEnumFilterStructuralWidget } from './BaseEnumFilter';

class MultiEnumFilterStructuralWidget<
  S extends EnumFilterWidgetState = EnumFilterWidgetState,
  CT extends EnumFilterWidgetConfig = EnumFilterWidgetConfig
> extends BaseEnumFilterStructuralWidget<number[] | string[], S, CT> {
  protected get displayText(): string {
    return ((this.props.value || []) as any[])
      .map(value =>
        value != null && this.state.optionMap[value] ? this.state.optionMap[value].label : value,
      )
      .join('、');
  }
}

export { MultiEnumFilterStructuralWidget };
