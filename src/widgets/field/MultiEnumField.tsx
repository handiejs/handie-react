import { EnumFieldWidgetConfig } from '@handie/runtime-core';
import { BaseEnumFieldStructuralWidget } from './BaseEnumField';

class MultiEnumFieldStructuralWidget<
  CT extends EnumFieldWidgetConfig = EnumFieldWidgetConfig
> extends BaseEnumFieldStructuralWidget<number[] | string[], CT> {
  protected get displayText(): string {
    return ((this.props.value || []) as any[])
      .map(value =>
        value != null && this.state.optionMap[value] ? this.state.optionMap[value].label : value,
      )
      .join('、');
  }
}

export { MultiEnumFieldStructuralWidget };
