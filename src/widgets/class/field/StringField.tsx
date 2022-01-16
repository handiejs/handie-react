import { StringFieldWidgetState, FieldWidgetConfig } from '@handie/runtime-core';
import { FieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FieldStructuralWidget } from './Field';

class StringFieldStructuralWidget<
  S extends StringFieldWidgetState = StringFieldWidgetState,
  CT extends FieldWidgetConfig = FieldWidgetConfig
> extends FieldStructuralWidget<string, CT, FieldHeadlessWidget<string, CT>, S> {
  public componentWillMount(): void {
    super.componentWillMount();
    this.setHeadlessWidget(new FieldHeadlessWidget(this.props, this.$$view));
  }
}

export { StringFieldStructuralWidget };
