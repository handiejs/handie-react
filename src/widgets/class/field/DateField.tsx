import { DateValue, DateFieldWidgetState, DateFieldWidgetConfig } from '@handie/runtime-core';
import { DateFieldHeadlessWidget } from '@handie/runtime-core/dist//widgets';

import { FieldStructuralWidget } from './Field';

function resolveDateValue(date: Date | null): DateValue {
  return date ? date.getTime() : '';
}

class DateFieldStructuralWidget<
  VT extends DateValue | DateValue[],
  S extends DateFieldWidgetState = DateFieldWidgetState,
  CT extends DateFieldWidgetConfig = DateFieldWidgetConfig
> extends FieldStructuralWidget<VT, CT, DateFieldHeadlessWidget<VT, CT>, S> {
  protected formatDate(value: DateValue): DateValue {
    return this.$$_h.formatDate(value);
  }

  protected getSeparator(): string {
    return this.config.separator || '-';
  }

  protected getRangeValue(): DateValue[] {
    return this.$$_h.getRangeValue();
  }

  protected getRangePlaceholders(): string[] {
    return this.$$_h.getRangePlaceholders();
  }

  protected onDateChange(date: Date | null): void {
    this.onChange(resolveDateValue(date) as VT);
  }

  protected onRangeChange(dates: (Date | null)[] | null): void {
    const { fromField, toField } = this.config;
    const range = dates ? dates.map(resolveDateValue) : [];

    if (!fromField && !toField) {
      this.onChange(range as VT);
    }

    this.$$view.setFieldValue(fromField!, range[0]);
    this.$$view.setFieldValue(toField!, range[1]);
  }

  public componentWillMount(): void {
    super.componentWillMount();
    this.setHeadlessWidget(new DateFieldHeadlessWidget(this.props, this.$$view));
  }
}

export { DateFieldStructuralWidget };
