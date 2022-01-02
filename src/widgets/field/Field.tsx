import { ValueChecker, ObjectViewContext } from '@handie/runtime-core';
import {
  FieldWidgetConfig,
  IFieldWidget,
  FieldHeadlessWidget as _FieldHeadlessWidget,
} from '@handie/runtime-core/dist/widgets';

import BaseHeadlessWidget from '../base';

export default class FieldHeadlessWidget<
  ValueType = any,
  CT extends FieldWidgetConfig = FieldWidgetConfig,
  HW extends _FieldHeadlessWidget<ValueType, CT> = _FieldHeadlessWidget<ValueType, CT>,
  S extends Record<string, any> = {}
> extends BaseHeadlessWidget<IFieldWidget<ValueType>, S, CT, HW, ObjectViewContext> {
  protected get showValidationRulesAsNative(): boolean {
    return this.$$_h.isValidationRulesShownAsNative(
      this.$$view.getConfig().showFieldValidationRulesAsNative,
    );
  }

  protected getPlaceholder(): string {
    return this.$$_h.getPlaceholder();
  }

  protected setValueChecker(checker: ValueChecker): void {
    this.$$view.setFieldChecker(this.props.field.name, checker);
  }

  protected formatValue(value: ValueType): string {
    return this.$$_h.format(value);
  }

  protected onChange(value: ValueType): void {
    this.props.onChange(value);
  }
}
