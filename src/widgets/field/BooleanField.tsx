import { BooleanFieldWidgetConfig } from '@handie/runtime-core';
import { BooleanFieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FieldStructuralWidget } from './Field';

class BooleanFieldStructuralWidget<
  CT extends BooleanFieldWidgetConfig = BooleanFieldWidgetConfig
> extends FieldStructuralWidget<boolean, CT, BooleanFieldHeadlessWidget<CT>> {
  protected get positiveLabel(): string {
    return this.$$_h.getPositiveLabel();
  }

  protected get negativeLabel(): string {
    return this.$$_h.getNegativeLabel();
  }

  protected get negativeFirst(): boolean {
    return this.$$_h.isNegativeFirst();
  }

  public componentWillMount(): void {
    this.setHeadlessWidget(new BooleanFieldHeadlessWidget(this.props, this.$$view));
  }
}

export { BooleanFieldStructuralWidget };
