import {
  RequestParams,
  ResponseSuccess,
  ResponseFail,
  ObjectValue,
  ListValue,
  FieldWidgetConfig,
  RelationFieldWidgetState,
} from '@handie/runtime-core';
import { DynamicRelationField } from '@handie/runtime-core/dist/types/input';
import { RelationFieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FieldStructuralWidget } from './Field';

class RelationFieldStructuralWidget<
  ValueType = ObjectValue | ListValue,
  S extends RelationFieldWidgetState<ValueType> = RelationFieldWidgetState<ValueType>,
  CT extends FieldWidgetConfig = FieldWidgetConfig
> extends FieldStructuralWidget<ValueType, CT, RelationFieldHeadlessWidget<ValueType, CT>, S> {
  protected get labelKey(): string {
    return this.$$_h.getLabelKey();
  }

  protected get valueKey(): string {
    return this.$$_h.getValueKey();
  }

  protected fetchRelatedList(
    params: RequestParams,
    success?: ResponseSuccess,
    fail?: ResponseFail,
  ): void {
    this.$$_h.fetchRelatedList(params, success, fail);
  }

  public componentWillMount(): void {
    this.setHeadlessWidget(new RelationFieldHeadlessWidget(this.props, this.$$view));

    if (
      !this.props.field.dynamic ||
      !(this.props.field as DynamicRelationField).referenceValueGetter
    ) {
      this.setState({ internalValue: this.props.value });
    }

    if (this.props.field.dynamic) {
      this.on('dataChange', dataSource =>
        this.$$_h.fetchReferenceValue(dataSource, ({ data }) =>
          this.setState({ internalValue: data }),
        ),
      );
    }
  }
}

export { RelationFieldStructuralWidget };
