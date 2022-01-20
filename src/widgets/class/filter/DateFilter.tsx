import { DateValue, DateFilterWidgetState, DateFilterWidgetConfig } from '@handie/runtime-core';
import { DateFilterHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FilterStructuralWidget } from './Filter';

class DateFilterStructuralWidget<
  S extends DateFilterWidgetState = DateFilterWidgetState,
  CT extends DateFilterWidgetConfig = DateFilterWidgetConfig
> extends FilterStructuralWidget<DateValue, CT, DateFilterHeadlessWidget<CT>, S> {
  public componentWillMount(): void {
    this.setHeadlessWidget(new DateFilterHeadlessWidget(this.props, this.$$view));
  }
}

export { DateFilterStructuralWidget };
