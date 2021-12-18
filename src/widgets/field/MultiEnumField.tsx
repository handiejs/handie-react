import BaseEnumFieldHeadlessWidget from './BaseEnumField';

export default class MultiEnumFieldHeadlessWidget extends BaseEnumFieldHeadlessWidget<
  number[] | string[]
> {
  protected get displayText(): string {
    return ((this.props.value || []) as any[])
      .map(value =>
        value != null && this.state.optionMap[value] ? this.state.optionMap[value].label : value,
      )
      .join('、');
  }
}
