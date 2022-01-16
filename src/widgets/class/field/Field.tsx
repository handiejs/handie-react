import {
  ContextExpression,
  ValueChecker,
  ObjectViewContext,
  FieldWidgetState,
  FieldWidgetConfig,
  IFieldWidget,
  isString,
  runExpression,
} from '@handie/runtime-core';
import { FieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { BaseStructuralWidget } from '../base';

class FieldStructuralWidget<
  ValueType = any,
  CT extends FieldWidgetConfig = FieldWidgetConfig,
  HW extends FieldHeadlessWidget<ValueType, CT> = FieldHeadlessWidget<ValueType, CT>,
  S extends FieldWidgetState = FieldWidgetState
> extends BaseStructuralWidget<IFieldWidget<ValueType>, S, CT, HW, ObjectViewContext> {
  public readonly state = { disabled: false } as S;

  protected isTrue(booleanOrExpr: boolean | ContextExpression, defaultReturnValue?: any): boolean {
    return isString(booleanOrExpr)
      ? !!runExpression(
          { value: this.$$view.getValue() },
          booleanOrExpr as ContextExpression,
          defaultReturnValue,
        )
      : (booleanOrExpr as boolean) === true;
  }

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

  public componentWillMount(): void {
    const { readonly, disabled } = this.props.field;

    if ((readonly !== undefined && this.isTrue(readonly, false)) || disabled === undefined) {
      return;
    }

    this.setState({ disabled: this.isTrue(disabled, false) });

    if (isString(disabled)) {
      this.on('change', () => this.setState(() => ({ disabled: this.isTrue(disabled, false) })));
    }
  }
}

export { FieldStructuralWidget };
