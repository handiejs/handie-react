import { IntegerFieldWidgetState, FieldWidgetConfig } from '@handie/runtime-core';
import { FieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FieldStructuralWidget } from './Field';

class IntegerFieldStructuralWidget<
  S extends IntegerFieldWidgetState = IntegerFieldWidgetState,
  CT extends FieldWidgetConfig = FieldWidgetConfig
> extends FieldStructuralWidget<number, CT, FieldHeadlessWidget<number, CT>, S> {
  public componentWillMount(): void {
    super.componentWillMount();
    this.setHeadlessWidget(new FieldHeadlessWidget(this.props, this.$$view));
  }
}

export { IntegerFieldStructuralWidget };
