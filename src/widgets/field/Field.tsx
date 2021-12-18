import {
  ConfigType,
  ValueChecker,
  ViewFieldDescriptor,
  ObjectViewContext,
  isBoolean,
  includes,
} from '@handie/runtime-core';

import BaseHeadlessWidget from '../base';

interface FieldWidgetProps<ValueType> {
  readonly field: ViewFieldDescriptor;
  readonly value: ValueType;
  readonly onChange: (value: ValueType) => void;
}

export default class FieldHeadlessWidget<
  ValueType = any,
  S extends Record<string, any> = {}
> extends BaseHeadlessWidget<FieldWidgetProps<ValueType>, S, ObjectViewContext> {
  protected get config(): ConfigType {
    return this.props.field.config || {};
  }

  protected get showValidationRulesAsNative(): boolean {
    const { showFieldValidationRulesAsNative } = this.$$view.getConfig();

    return isBoolean(showFieldValidationRulesAsNative)
      ? showFieldValidationRulesAsNative
      : this.getCommonBehavior('field.showValidationRulesAsNative', false);
  }

  protected getPlaceholder(): string {
    let { showHintAsPlaceholder } = this.config;

    if (showHintAsPlaceholder === undefined) {
      showHintAsPlaceholder = this.getCommonBehavior('field.showHintAsPlaceholder');
    }

    const { field } = this.props;

    let defaultPlaceholder: string = '';

    if (field.dataType) {
      defaultPlaceholder = `${
        includes(field.dataType, ['string', 'text', 'int', 'float']) ? '请输入' : '请选择'
      }${field.label || ''}`;
    }

    const placeholder = field.placeholder || defaultPlaceholder;

    return showHintAsPlaceholder ? field.hint || placeholder : placeholder;
  }

  protected setValueChecker(checker: ValueChecker): void {
    this.$$view.setFieldChecker(this.props.field.name, checker);
  }

  protected onChange(value: ValueType): void {
    this.props.onChange(value);
  }
}
