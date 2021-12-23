import {
  FilterRendererProps,
  capitalize,
  resolveWidgetCtor,
  resolveFilterRenderType,
} from '@handie/runtime-core';

import { ReactNode, JSXElementConstructor } from 'react';

import BaseRenderer from '../base';

export default class FilterRenderer extends BaseRenderer<FilterRendererProps> {
  private handleFilterChange(value: any): void {
    this.props.onChange(this.props.filter.name, value);
  }

  public render(): ReactNode {
    const { filter, value } = this.props;
    const componentRenderer = filter.widget;

    const FilterWidget = resolveWidgetCtor(
      this.$$view.getModuleContext(),
      componentRenderer,
      () =>
        `${resolveFilterRenderType(filter)
          .split('-')
          .map(part => capitalize(part))
          .join('')}${(filter.dataType || '')
          .split('-')
          .map(part => capitalize(part))
          .join('')}FilterWidget`,
    ) as JSXElementConstructor<
      Pick<FilterRendererProps, 'filter' | 'value'> & { onChange: (value: any) => void }
    >;

    return FilterWidget ? (
      <FilterWidget
        filter={filter}
        value={value}
        onChange={value => this.handleFilterChange(value)}
      />
    ) : null;
  }
}
