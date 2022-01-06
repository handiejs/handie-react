import { BaseWidgetState, FieldWidgetConfig } from '@handie/runtime-core';
import { FieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FieldStructuralWidget } from './Field';

class TextFieldStructuralWidget<
  S extends BaseWidgetState = BaseWidgetState,
  CT extends FieldWidgetConfig = FieldWidgetConfig
> extends FieldStructuralWidget<string, CT, FieldHeadlessWidget<string, CT>, S> {
  public componentWillMount(): void {
    this.setHeadlessWidget(new FieldHeadlessWidget(this.props, this.$$view));
  }
}

export { TextFieldStructuralWidget };
