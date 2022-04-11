import { ReactNode, JSXElementConstructor } from 'react';

import {
  FieldRendererProps,
  capitalize,
  resolveWidgetCtor,
  resolveFieldRenderType,
} from '@handie/runtime-core';

import BaseRenderer from '../base';

export default class FieldRenderer extends BaseRenderer<FieldRendererProps> {
  private handleFieldChange(value: any): void {
    this.props.onChange!(this.props.field.name, value);
  }

  public render(): ReactNode {
    const { field, value, readonly } = this.props;
    const componentRenderer = field.widget;

    const FieldWidget = resolveWidgetCtor(
      this.$$view.getModuleContext(),
      componentRenderer,
      () =>
        `${resolveFieldRenderType(field)
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
      <FieldWidget field={field} value={value} onChange={value => this.handleFieldChange(value)} />
    ) : null;
  }
}
