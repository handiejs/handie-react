import { ViewFieldDescriptor, capitalize, resolveWidgetCtor } from '@handie/runtime-core';

import { ReactNode, JSXElementConstructor } from 'react';

import BaseRenderer from '../base';
import { getRenderType } from './helper';

interface FieldRendererProps {
  field: ViewFieldDescriptor;
  value: any;
  readonly: boolean;
  onChange: (fieldName: string, value: any) => void;
}

export default class FieldRenderer extends BaseRenderer<FieldRendererProps> {
  private handleFieldChange(value: any): void {
    this.props.onChange(this.props.field.name, value);
  }

  public render(): ReactNode {
    const { field, value, readonly } = this.props;
    const componentRenderer = field.widget;

    const FieldWidget = resolveWidgetCtor(
      this.$$view.getModuleContext(),
      componentRenderer,
      () =>
        `${getRenderType(field)
          .split('-')
          .map(part => capitalize(part))
          .join('')}${readonly ? 'Read' : 'Edit'}${(field.dataType || '')
          .split('-')
          .map(part => capitalize(part))
          .join('')}FieldWidget`,
    ) as JSXElementConstructor<
      Pick<FieldRendererProps, 'field' | 'value'> & {
        onChange: (value: any) => void;
      }
    >;

    return FieldWidget ? (
      <FieldWidget field={field} value={value} onChange={this.handleFieldChange} />
    ) : null;
  }
}
