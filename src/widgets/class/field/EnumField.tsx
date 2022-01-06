import { EnumFieldWidgetConfig, EnumFieldWidgetState, isNumeric } from '@handie/runtime-core';

import { BaseEnumFieldStructuralWidget } from './BaseEnumField';

class EnumFieldStructuralWidget<
  S extends EnumFieldWidgetState = EnumFieldWidgetState,
  CT extends EnumFieldWidgetConfig = EnumFieldWidgetConfig
> extends BaseEnumFieldStructuralWidget<number | string, S, CT> {
  protected get displayText(): string {
    const chosen = this.state.options.find(opt =>
      isNumeric(opt.value) && isNumeric(this.props.value)
        ? Number(opt.value) === Number(this.props.value)
        : opt.value === this.props.value,
    );

    return chosen ? chosen.label : '';
  }
}

export { EnumFieldStructuralWidget };
