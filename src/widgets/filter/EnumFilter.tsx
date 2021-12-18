import { isNumeric } from '@handie/runtime-core';

import BaseEnumFilterHeadlessWidget from './BaseEnumFilter';

export default class EnumFilterHeadlessWidget extends BaseEnumFilterHeadlessWidget<
  number | string
> {
  protected get displayText(): string {
    const chosen = this.state.options.find(opt =>
      isNumeric(opt.value) && isNumeric(this.props.value)
        ? Number(opt.value) === Number(this.props.value)
        : opt.value === this.props.value,
    );

    return chosen ? chosen.label : '';
  }
}
