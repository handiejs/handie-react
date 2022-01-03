import { FieldWidgetConfig } from '@handie/runtime-core';
import { FieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FieldStructuralWidget } from './Field';

class IntegerFieldStructuralWidget<
  CT extends FieldWidgetConfig = FieldWidgetConfig
> extends FieldStructuralWidget<number, CT> {
  public componentWillMount(): void {
    this.setHeadlessWidget(new FieldHeadlessWidget(this.props, this.$$view));
  }
}

export { IntegerFieldStructuralWidget };
