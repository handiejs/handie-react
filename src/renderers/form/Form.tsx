import { ReactNode } from 'react';

import {
  ContextExpression,
  ViewFieldDescriptor,
  GridBreakpoint,
  FormRendererProps,
  isBoolean,
  isString,
  isNumber,
  isFunction,
  runExpression,
  getControl,
  getBehaviorByKey,
  resolveFieldBehavior,
  renderFormChildren,
  normalizeClassName,
} from '@handie/runtime-core';

import { ComponentCtor } from '../../types/component';
import BaseRenderer from '../base';
import FieldRenderer from '../field';

export default class FormRenderer extends BaseRenderer<FormRendererProps> {
  private isTrue(expression: ContextExpression, defaultReturnValue?: any): boolean {
    return !!runExpression({ value: this.props.value }, expression, defaultReturnValue);
  }

  private resolveFormLayout(): 'horizontal' | 'vertical' | 'inline' {
    const { config, behavior } = this.props;

    if (config.formLayout) {
      return config.formLayout;
    }

    return behavior && behavior.formLayout
      ? behavior.formLayout
      : getBehaviorByKey('common.view.objectViewFormLayout', 'horizontal');
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

  private renderField(field: ViewFieldDescriptor): ReactNode {
    const { name, label, hint, config = {} } = field;

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
        const Tooltip = getControl('Tooltip') as ComponentCtor;
        const Icon = getControl('Icon') as ComponentCtor;

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

    const FormField = getControl('FormField') as ComponentCtor;

    return FormField ? (
      <FormField key={`${name}FormFieldOfFormRenderer`} {...formItemProps}>
        {formItemChildren}
      </FormField>
    ) : null;
  }

  private renderFieldRow(
    fields: ViewFieldDescriptor[],
    cols: GridBreakpoint[] | number,
  ): ReactNode {
    const GridRow = getControl('GridRow') as ComponentCtor;
    const GridCol = getControl('GridCol') as ComponentCtor;

    let span: number | undefined;

    if (isNumber(cols) && cols > -1) {
      span = 24 / fields.length;
    }

    return GridRow ? (
      <GridRow key={`FieldRow${fields[0].name}OfFormRenderer`} gutter={24}>
        {fields.map((field, index) =>
          GridCol ? (
            <GridCol
              key={`FieldCol${field.name}OfFormRenderer`}
              {...(isNumber(cols) ? { span } : cols[index])}
            >
              {this.renderField(field)}
            </GridCol>
          ) : null,
        )}
      </GridRow>
    ) : null;
  }

  private renderFieldGroup(title: string, formFieldNodes: ReactNode[]): ReactNode {
    return (
      <div
        className='HandieFormRenderer-group'
        key={`${title}${formFieldNodes.length}FieldGroupOfFormRenderer`}
      >
        <div className='HandieFormRenderer-groupHeader'>{title}</div>
        <div className='HandieFormRenderer-groupBody'>{formFieldNodes}</div>
      </div>
    );
  }

  public render(): ReactNode {
    const FormControl = getControl('Form') as ComponentCtor;
    const FormField = getControl('FormField') as ComponentCtor;

    const { arrangement } = this.props.config || {};

    return FormControl ? (
      <FormControl
        className={normalizeClassName('HandieFormRenderer', this.props.className)}
        layout={this.resolveFormLayout()}
        labelOption={{ width: this.resolveLabelWidth(), align: 'right' }}
        controlSize={this.resolveFormControlSize()}
        hideMessage={!this.resolveShowValidationMessage()}
      >
        {renderFormChildren(
          this.props.fields.filter(
            ({ available }) => !isString(available) || this.isTrue(available!, false),
          ),
          isFunction(arrangement) ? arrangement({ ...(this.props.value || {}) }) : arrangement,
          this.renderFieldGroup.bind(this),
          this.renderField.bind(this),
          this.renderFieldRow.bind(this),
        )}
        {this.props.children && FormField ? (
          <FormField label=' '>{this.props.children}</FormField>
        ) : null}
      </FormControl>
    ) : null;
  }
}
