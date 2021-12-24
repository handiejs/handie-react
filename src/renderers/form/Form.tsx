import {
  ContextExpression,
  FormRendererProps,
  isBoolean,
  isString,
  isNumber,
  runExpression,
  getControl,
  getBehaviorByKey,
  resolveFieldBehavior,
} from '@handie/runtime-core';

import { JSXElementConstructor, ReactNode } from 'react';

import BaseRenderer from '../base';
import FieldRenderer from '../field';

export default class FormRenderer extends BaseRenderer<FormRendererProps> {
  private isTrue(expression: ContextExpression, defaultReturnValue?: any): boolean {
    return !!runExpression({ value: this.props.value }, expression, defaultReturnValue);
  }

  private resolveReadonly(readonly?: boolean | ContextExpression): boolean {
    if (isBoolean(readonly)) {
      return readonly as boolean;
    }

    return isString(readonly) ? this.isTrue(readonly as string) : false;
  }

  private resolveFieldRequired(
    readonly?: boolean,
    required?: boolean | ContextExpression,
  ): boolean {
    if (readonly) {
      return false;
    }

    return isString(required) ? this.isTrue(required as string) : (required as boolean);
  }

  private resolveLabelWidth(): string {
    const labelWidth =
      this.props.config.formControlLabelWidth ||
      getBehaviorByKey('common.view.objectViewFormControlLabelWidth', '');

    return isNumber(labelWidth) ? `${labelWidth}px` : labelWidth;
  }

  private resolveFormControlSize(): string {
    return (
      this.props.config.formControlSize ||
      getBehaviorByKey('common.view.objectViewFormControlSize', '')
    );
  }

  private resolveShowValidationMessage(): boolean {
    const showValidationMessage = this.props.config.showValidationMessage;

    return isBoolean(showValidationMessage)
      ? showValidationMessage
      : getBehaviorByKey('common.view.objectViewShowValidationMessage');
  }

  private resolveFormItems(): ReactNode {
    const formItems: ReactNode[] = [];

    this.props.fields.forEach(field => {
      if (field.hidden) {
        return;
      }

      const { name, label, available, hint, config = {} } = field;

      if (isString(available) && !this.isTrue(available!, false)) {
        return;
      }

      const fieldValidation = (this.props.validation || {})[name] || { success: true };
      const readonly = this.resolveReadonly(this.props.readonly || field.readonly);

      const formItemProps: Record<string, any> = {
        required: this.resolveFieldRequired(readonly, field.required),
        message: fieldValidation.success ? '' : fieldValidation.message,
      };

      const formItemChildren: ReactNode[] = [
        <FieldRenderer
          key={`${name}FieldRendererOfFormRenderer`}
          field={field}
          value={this.props.value[name]}
          readonly={readonly}
          onChange={this.props.onChange}
        />,
      ];

      const resolveBehavior = resolveFieldBehavior.bind(null, config);

      if (resolveBehavior('showHintAtFormItem', false) === true) {
        if (resolveBehavior('hintPositionOfFormItem', 'explain') === 'label' && hint) {
          const Tooltip = getControl('Tooltip') as JSXElementConstructor<any>;
          const Icon = getControl('Icon') as JSXElementConstructor<any>;

          formItemProps.label = (
            <span>
              {label}
              {Tooltip ? (
                <Tooltip content={hint}>
                  {Icon ? <Icon refs={resolveBehavior('hintIcon', '')} /> : null}
                </Tooltip>
              ) : null}
            </span>
          );
        } else {
          formItemProps.label = label;
          formItemProps.hint = hint;
        }
      } else {
        formItemProps.label = label;
      }

      const FormField = getControl('FormField') as JSXElementConstructor<any>;

      if (FormField) {
        formItems.push(
          <FormField key={`${name}FormFieldOfFormRenderer`} {...formItemProps}>
            {formItemChildren}
          </FormField>,
        );
      }
    });

    return formItems;
  }

  public render(): ReactNode {
    const FormControl = getControl('Form') as JSXElementConstructor<any>;

    return FormControl ? (
      <FormControl
        className={this.props.className}
        labelOption={{ width: this.resolveLabelWidth(), align: 'right' }}
        controlSize={this.resolveFormControlSize()}
        hideMessage={!this.resolveShowValidationMessage()}
      >
        {this.resolveFormItems()}
      </FormControl>
    ) : null;
  }
}
