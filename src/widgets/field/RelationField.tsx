import {
  RequestParams,
  ResponseSuccess,
  ResponseFail,
  ObjectValue,
  ListValue,
} from '@handie/runtime-core';
import { DynamicRelationField } from '@handie/runtime-core/dist/types/input';
import {
  FieldWidgetConfig,
  RelationFieldWidgetState,
  RelationFieldHeadlessWidget as _RelationFieldHeadlessWidget,
} from '@handie/runtime-core/dist/widgets';

import FieldHeadlessWidget from './Field';

export default class RelationFieldHeadlessWidget<
  ValueType = ObjectValue | ListValue,
  CT extends FieldWidgetConfig = FieldWidgetConfig
> extends FieldHeadlessWidget<
  ValueType,
  CT,
  _RelationFieldHeadlessWidget<ValueType, CT>,
  RelationFieldWidgetState<ValueType>
> {
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
