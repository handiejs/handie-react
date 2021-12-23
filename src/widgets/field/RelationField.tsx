import {
  RequestParams,
  ResponseSuccess,
  ResponseFail,
  ObjectValue,
  ListValue,
  RelationFieldWidgetState,
  noop,
} from '@handie/runtime-core';
import { DynamicRelationField } from '@handie/runtime-core/dist/types/input';

import FieldHeadlessWidget from './Field';

export default class RelationFieldHeadlessWidget<
  ValueType = ObjectValue | ListValue
> extends FieldHeadlessWidget<ValueType, RelationFieldWidgetState<ValueType>> {
  protected get labelKey(): string {
    return (
      (this.props.field.dynamic && (this.props.field as DynamicRelationField).relatedLabelKey) ||
      'label'
    );
  }

  protected get valueKey(): string {
    let key = 'value';

    if (this.props.field.dynamic) {
      key =
        (this.props.field as DynamicRelationField).relatedValueKey ||
        (this.props.field as DynamicRelationField).relatedPrimaryKey ||
        key;
    }

    return key;
  }

  private fetchReferenceValue(data: ValueType): void {
    const { referenceValueGetter } = this.props.field as DynamicRelationField;

    if (!referenceValueGetter) {
      return;
    }

    referenceValueGetter(data).then(result => {
      if (result.success) {
        this.setState({ internalValue: result.data });
      }
    });
  }

  protected fetchRelatedList(
    params: RequestParams,
    success: ResponseSuccess = noop,
    fail: ResponseFail = noop,
  ): void {
    const { dynamic, relatedListGetter } = this.props.field as DynamicRelationField;

    if (!dynamic || !relatedListGetter) {
      return;
    }

    relatedListGetter(params).then(result => {
      if (result.success) {
        success(result.data, result.extra, result);
      } else {
        fail(result.message, result);
      }
    });
  }

  public componentWillMount(): void {
    if (
      !this.props.field.dynamic ||
      !(this.props.field as DynamicRelationField).referenceValueGetter
    ) {
      this.setState({ internalValue: this.props.value });
    }

    if (this.props.field.dynamic) {
      this.on('dataChange', dataSource => this.fetchReferenceValue(dataSource));
    }
  }
}
