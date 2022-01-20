import { EnumFilterWidgetConfig, EnumFilterWidgetState, isNumeric } from '@handie/runtime-core';

import { BaseEnumFilterStructuralWidget } from './BaseEnumFilter';

class EnumFilterStructuralWidget<
  S extends EnumFilterWidgetState = EnumFilterWidgetState,
  CT extends EnumFilterWidgetConfig = EnumFilterWidgetConfig
> extends BaseEnumFilterStructuralWidget<number | string, S, CT> {
  protected get displayText(): string {
    const chosen = this.state.options.find(opt =>
      isNumeric(opt.value) && isNumeric(this.props.value)
        ? Number(opt.value) === Number(this.props.value)
        : opt.value === this.props.value,
    );

    return chosen ? chosen.label : '';
  }
}

export { EnumFilterStructuralWidget };
