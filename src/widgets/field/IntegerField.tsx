import { isFunction } from '@handie/runtime-core';

import FieldHeadlessWidget from './Field';

export default class IntegerFieldHeadlessWidget extends FieldHeadlessWidget<number> {
  protected formatValue(value: number = this.props.value): string {
    return isFunction(this.props.field.formatter) ? this.props.field.formatter!(value) : value;
  }
}
