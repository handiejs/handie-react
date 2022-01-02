import {
  BooleanFieldWidgetConfig,
  BooleanFieldHeadlessWidget as _BooleanFieldHeadlessWidget,
} from '@handie/runtime-core/dist/widgets';

import FieldHeadlessWidget from './Field';

export default class BooleanFieldHeadlessWidget<
  CT extends BooleanFieldWidgetConfig = BooleanFieldWidgetConfig
> extends FieldHeadlessWidget<boolean, CT, _BooleanFieldHeadlessWidget<CT>> {
  protected get positiveLabel(): string {
    return this.$$_h.getPositiveLabel();
  }

  protected get negativeLabel(): string {
    return this.$$_h.getNegativeLabel();
  }

  protected get negativeFirst(): boolean {
    return this.$$_h.isNegativeFirst();
  }
}
