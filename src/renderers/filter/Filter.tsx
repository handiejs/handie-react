import { capitalize, resolveWidgetCtor } from '@handie/runtime-core';
import { FilterDescriptor } from '@handie/runtime-core/dist/types/input';

import { ReactNode, JSXElementConstructor } from 'react';

import BaseRenderer from '../base';
import { getRenderType } from './helper';

interface FilterRendererProps {
  filter: FilterDescriptor;
  value: any;
  onChange: (filterName: string, value: any) => void;
}

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
        `${getRenderType(filter)
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
      <FilterWidget filter={filter} value={value} onChange={this.handleFilterChange} />
    ) : null;
  }
}
