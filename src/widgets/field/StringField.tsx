import { isFunction } from '@handie/runtime-core';

import FieldHeadlessWidget from './Field';

export default class StringFieldHeadlessWidget extends FieldHeadlessWidget<string> {
  protected formatValue(value: string = this.props.value): string {
    return isFunction(this.props.field.formatter) ? this.props.field.formatter!(value) : value;
  }
}
