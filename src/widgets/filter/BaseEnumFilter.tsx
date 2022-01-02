import {
  FilterWidgetConfig,
  EnumFilterWidgetState,
  EnumFilterHeadlessWidget,
} from '@handie/runtime-core/dist/widgets';

import FilterHeadlessWidget from './Filter';

export default class BaseEnumFilterHeadlessWidget<
  ValueType,
  CT extends FilterWidgetConfig = FilterWidgetConfig
> extends FilterHeadlessWidget<
  ValueType,
  CT,
  EnumFilterHeadlessWidget<ValueType, CT>,
  EnumFilterWidgetState
> {
  public readonly state = { options: [], optionMap: {} } as EnumFilterWidgetState;

  public componentWillMount(): void {
    this.$$_h.initOptions(this.$$view, options =>
      this.setState({
        options,
        optionMap: options.reduce((prev, opt) => ({ ...prev, [opt.value]: opt }), {}),
      }),
    );
  }
}
