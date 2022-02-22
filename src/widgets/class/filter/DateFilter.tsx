import { DateValue, DateFilterWidgetState, DateFilterWidgetConfig } from '@handie/runtime-core';
import { DateFilterHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FilterStructuralWidget } from './Filter';

class DateFilterStructuralWidget<
  VT extends DateValue | DateValue[],
  S extends DateFilterWidgetState = DateFilterWidgetState,
  CT extends DateFilterWidgetConfig = DateFilterWidgetConfig
> extends FilterStructuralWidget<VT, CT, DateFilterHeadlessWidget<VT, CT>, S> {
  protected getRangeValue(): DateValue[] {
    return this.$$_h.getRangeValue();
  }

  protected getRangePlaceholders(): string[] {
    return this.$$_h.getRangePlaceholders();
  }

  protected setDefaultFormat(format: string = ''): void {
    this.$$_h.setDefaultFormat(format);
  }

  protected getDisplayFormat(): string {
    return this.$$_h.getDisplayFormat();
  }

  protected getSeparator(): string {
    return this.$$_h.getSeparator();
  }

  protected onRangeChange(dates: (Date | null)[] | null): void {
    const { fromField, toField } = this.config;
    const range = dates ? dates.map(date => this.$$_h.resolveDateValue(date)) : [];

    if (!fromField && !toField) {
      this.onChange(range as VT);
    }

    this.$$search.setFilterValue(fromField!, range[0]);
    this.$$search.setFilterValue(toField!, range[1]);
  }

  public componentWillMount(): void {
    this.setHeadlessWidget(new DateFilterHeadlessWidget(this.props, this.$$view));
  }
}

export { DateFilterStructuralWidget };
