import { EnumFieldWidgetConfig, isNumeric } from '@handie/runtime-core';

import { BaseEnumFieldStructuralWidget } from './BaseEnumField';

class EnumFieldStructuralWidget<
  CT extends EnumFieldWidgetConfig = EnumFieldWidgetConfig
> extends BaseEnumFieldStructuralWidget<number | string, CT> {
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
