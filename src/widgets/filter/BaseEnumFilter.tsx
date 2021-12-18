import { EnumFieldOption, EnumField } from '@handie/runtime-core/dist/types/input';

import { resolveEnumOptions } from '../helper';
import FilterHeadlessWidget from './Filter';

interface BaseEnumFilterWidgetState {
  options: EnumFieldOption[];
  optionMap: Record<string, EnumFieldOption>;
}

export default class BaseEnumFilterHeadlessWidget<ValueType> extends FilterHeadlessWidget<
  ValueType,
  BaseEnumFilterWidgetState
> {
  public readonly state = { options: [], optionMap: {} } as BaseEnumFilterWidgetState;

  public componentWillMount(): void {
    resolveEnumOptions(this.$$view, this.props.filter as EnumField, options =>
      this.setState({
        options,
        optionMap: options.reduce((prev, opt) => ({ ...prev, [opt.value]: opt }), {}),
      }),
    );
  }
}
