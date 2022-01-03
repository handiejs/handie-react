import { DataValue, BaseWidgetState, FieldWidgetConfig } from '@handie/runtime-core';
import { FieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FieldStructuralWidget } from './Field';

class UnknownFieldStructuralWidget<
  VT extends DataValue = DataValue,
  S extends BaseWidgetState = BaseWidgetState,
  CT extends FieldWidgetConfig = FieldWidgetConfig
> extends FieldStructuralWidget<VT, CT, FieldHeadlessWidget<VT, CT>, S> {
  public componentWillMount(): void {
    this.setHeadlessWidget(new FieldHeadlessWidget(this.props, this.$$view));
  }
}

export { UnknownFieldStructuralWidget };
