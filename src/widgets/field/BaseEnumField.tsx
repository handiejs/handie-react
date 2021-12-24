import {
  ObjectValue,
  EnumFieldOption,
  ResolvedEnumFieldOption,
  EnumFieldWidgetState,
  isString,
  runExpression,
} from '@handie/runtime-core';
import { EnumField } from '@handie/runtime-core/dist/types/input';

import { resolveEnumOptions } from '../helper';
import FieldHeadlessWidget from './Field';

export default class BaseEnumFieldHeadlessWidget<ValueType> extends FieldHeadlessWidget<
  ValueType,
  EnumFieldWidgetState
> {
  public readonly state = {
    internalOptions: [],
    options: [],
    optionMap: {},
  } as EnumFieldWidgetState;

  private resolveOptions(
    record: ObjectValue,
    options: EnumFieldOption[] = this.state.internalOptions,
  ): ResolvedEnumFieldOption[] {
    const resolved: ResolvedEnumFieldOption[] = [];

    options.forEach(({ available, ...others }) => {
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
        options: this.resolveOptions(this.$$view.getValue(), options),
        optionMap: options.reduce((prev, opt) => ({ ...prev, [opt.value]: opt }), {}),
      });

      if (options.some(({ available }) => isString(available))) {
        this.on('change', value => this.setState({ options: this.resolveOptions(value) }));
      }
    });
  }
}
