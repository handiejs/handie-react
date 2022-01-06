import { ReactNode } from 'react';

import {
  ViewFieldDescriptor,
  ViewWidgetConfig,
  ObjectViewWidgetState,
  getRenderer,
} from '@handie/runtime-core';

import { ComponentCtor } from '../../../types/component';
import { ObjectViewStructuralWidget } from './ObjectView';

class FormViewStructuralWidget<
  S extends ObjectViewWidgetState = ObjectViewWidgetState,
  CT extends ViewWidgetConfig = ViewWidgetConfig
> extends ObjectViewStructuralWidget<S, CT> {
  protected getRecordId(): string {
    return this.$$app.history.getLocation().params.id || '';
  }

  protected renderForm(
    options: { readonly?: boolean; fields?: ViewFieldDescriptor[] } = {},
  ): ReactNode {
    const { readonly = false, fields = this.fields } = options;
    const FormRenderer = getRenderer('FormRenderer') as ComponentCtor;

    return FormRenderer ? (
      <FormRenderer
        fields={fields}
        value={this.state.value}
        validation={this.state.validation}
        config={this.config}
        readonly={readonly}
        onChange={this.onFieldValueChange.bind(this)}
      />
    ) : null;
  }

  public componentDidMount(): void {
    const ctx = this.$$view;
    const id = this.getRecordId();

    if (id && ctx.getOne) {
      ctx.getOne(id, data => {
        this.setState({ dataSource: data });
        ctx.setValue(data);
      });
    }
  }

  public componentWillUnmount(): void {
    super.componentWillUnmount();
    this.$$view.reset();
  }
}

export { FormViewStructuralWidget };
