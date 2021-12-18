import { ObjectValue, isString, runExpression } from '@handie/runtime-core';
import { EnumFieldOption, EnumField } from '@handie/runtime-core/dist/types/input';

import { resolveEnumOptions } from '../helper';
import FieldHeadlessWidget from './Field';

interface ResolvedOption extends Omit<EnumFieldOption, 'available'> {
  disabled: boolean;
}

interface BaseEnumFieldWidgetState {
  internalOptions: EnumFieldOption[];
  options: ResolvedOption[];
  optionMap: Record<string, EnumFieldOption>;
}

export default class BaseEnumFieldHeadlessWidget<ValueType> extends FieldHeadlessWidget<
  ValueType,
  BaseEnumFieldWidgetState
> {
  public readonly state = {
    internalOptions: [],
    options: [],
    optionMap: {},
  } as BaseEnumFieldWidgetState;

  private resolveOptions(record: ObjectValue): ResolvedOption[] {
    const resolved: ResolvedOption[] = [];

    this.state.internalOptions.forEach(({ available, ...others }) => {
      let optionAvailable = true;

      if (isString(available)) {
        optionAvailable = runExpression({ value: record }, available!);
      }

      let disabled = false;

      if (!optionAvailable) {
        let { showUnavailableOption } = this.config;

        if (showUnavailableOption === undefined) {
          showUnavailableOption = this.getCommonBehavior('field.showUnavailableOption');
        }

        if (showUnavailableOption !== true) {
          return;
        }

        disabled = true;
      }

      resolved.push({ ...others, disabled });
    });

    return resolved;
  }

  public componentWillMount(): void {
    resolveEnumOptions(this.$$view, this.props.field as EnumField, options => {
      this.setState({
        internalOptions: options,
        options: this.resolveOptions(this.$$view.getValue()),
        optionMap: options.reduce((prev, opt) => ({ ...prev, [opt.value]: opt }), {}),
      });

      if (options.some(({ available }) => isString(available))) {
        this.on('change', value => this.setState({ options: this.resolveOptions(value) }));
      }
    });
  }
}
