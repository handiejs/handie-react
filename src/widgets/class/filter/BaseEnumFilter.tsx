import { FilterWidgetConfig, EnumFilterWidgetState } from '@handie/runtime-core';
import { EnumFilterHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FilterStructuralWidget } from './Filter';

class BaseEnumFilterStructuralWidget<
  ValueType,
  CT extends FilterWidgetConfig = FilterWidgetConfig
> extends FilterStructuralWidget<
  ValueType,
  CT,
  EnumFilterHeadlessWidget<ValueType, CT>,
  EnumFilterWidgetState
> {
  public readonly state = { options: [], optionMap: {} } as EnumFilterWidgetState;

  public componentWillMount(): void {
    this.setHeadlessWidget(new EnumFilterHeadlessWidget(this.props, this.$$view));

    this.$$_h.initOptions(this.$$view, options =>
      this.setState({
        options,
        optionMap: options.reduce((prev, opt) => ({ ...prev, [opt.value]: opt }), {}),
      }),
    );
  }
}

export { BaseEnumFilterStructuralWidget };
