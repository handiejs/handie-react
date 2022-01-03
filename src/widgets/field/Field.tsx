import {
  ValueChecker,
  ObjectViewContext,
  FieldWidgetConfig,
  IFieldWidget,
} from '@handie/runtime-core';
import { FieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { BaseStructuralWidget } from '../base';

class FieldStructuralWidget<
  ValueType = any,
  CT extends FieldWidgetConfig = FieldWidgetConfig,
  HW extends FieldHeadlessWidget<ValueType, CT> = FieldHeadlessWidget<ValueType, CT>,
  S extends Record<string, any> = {}
> extends BaseStructuralWidget<IFieldWidget<ValueType>, S, CT, HW, ObjectViewContext> {
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

  protected formatValue(value: ValueType = this.props.value): string {
    return this.$$_h.format(value);
  }

  protected onChange(value: ValueType): void {
    this.props.onChange(value);
  }
}

export { FieldStructuralWidget };
