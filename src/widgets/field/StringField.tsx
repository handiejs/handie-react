import { FieldWidgetConfig } from '@handie/runtime-core';
import { FieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FieldStructuralWidget } from './Field';

class StringFieldStructuralWidget<
  CT extends FieldWidgetConfig = FieldWidgetConfig
> extends FieldStructuralWidget<string, CT> {
  public componentWillMount(): void {
    this.setHeadlessWidget(new FieldHeadlessWidget(this.props, this.$$view));
  }
}

export { StringFieldStructuralWidget };
