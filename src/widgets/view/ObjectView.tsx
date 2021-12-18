import { ValidationResult, ObjectViewContext } from '@handie/runtime-core';

import ViewHeadlessWidget, { ViewWidgetState } from './View';

interface ObjectViewWidgetState extends ViewWidgetState {
  dataSource: Record<string, any>;
  value: Record<string, any>;
  validation: Record<string, ValidationResult>;
}

export default class ObjectViewHeadlessWidget extends ViewHeadlessWidget<
  ObjectViewContext,
  ObjectViewWidgetState
> {
  public readonly state = {
    loading: false,
    dataSource: {},
    value: {},
    validation: {},
  };

  protected onFieldValueChange(fieldName: string, value: any): void {
    this.$$view.setFieldValue(fieldName, value);
  }

  public componentWillMount(): void {
    super.componentWillMount();

    this.setState({ value: this.$$view.getValue() });

    this.on({
      dataChange: dataSource => {
        this.setState({ dataSource: dataSource });
        this.$$view.setValue(dataSource);
      },
      fieldValidate: ({ name, result }) =>
        this.setState({ validation: { ...this.state.validation, [name]: result } }),
      change: value => this.setState({ value }),
    });
  }
}
