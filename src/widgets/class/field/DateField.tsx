import { DateValue, DateFieldWidgetState, DateFieldWidgetConfig } from '@handie/runtime-core';
import { DateFieldHeadlessWidget } from '@handie/runtime-core/dist//widgets';

import { FieldStructuralWidget } from './Field';

class DateFieldStructuralWidget<
  S extends DateFieldWidgetState = DateFieldWidgetState,
  CT extends DateFieldWidgetConfig = DateFieldWidgetConfig
> extends FieldStructuralWidget<DateValue, CT, DateFieldHeadlessWidget<CT>, S> {
  public componentWillMount(): void {
    super.componentWillMount();
    this.setHeadlessWidget(new DateFieldHeadlessWidget(this.props, this.$$view));
  }
}

export { DateFieldStructuralWidget };
