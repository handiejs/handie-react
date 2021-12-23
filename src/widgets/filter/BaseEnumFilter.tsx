import { EnumFilterWidgetState } from '@handie/runtime-core';
import { EnumField } from '@handie/runtime-core/dist/types/input';

import { resolveEnumOptions } from '../helper';
import FilterHeadlessWidget from './Filter';

export default class BaseEnumFilterHeadlessWidget<ValueType> extends FilterHeadlessWidget<
  ValueType,
  EnumFilterWidgetState
> {
  public readonly state = { options: [], optionMap: {} } as EnumFilterWidgetState;

  public componentWillMount(): void {
    resolveEnumOptions(this.$$view, this.props.filter as EnumField, options =>
      this.setState({
        options,
        optionMap: options.reduce((prev, opt) => ({ ...prev, [opt.value]: opt }), {}),
      }),
    );
  }
}
