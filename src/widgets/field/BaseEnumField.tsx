import { isString } from '@handie/runtime-core';
import {
  EnumFieldWidgetConfig,
  EnumFieldWidgetState,
  EnumFieldHeadlessWidget,
} from '@handie/runtime-core/dist/widgets';

import FieldHeadlessWidget from './Field';

export default class BaseEnumFieldHeadlessWidget<
  ValueType,
  CT extends EnumFieldWidgetConfig = EnumFieldWidgetConfig
> extends FieldHeadlessWidget<
  ValueType,
  CT,
  EnumFieldHeadlessWidget<ValueType, CT>,
  EnumFieldWidgetState
> {
  public readonly state = {
    internalOptions: [],
    options: [],
    optionMap: {},
  } as EnumFieldWidgetState;

  public componentWillMount(): void {
    this.$$_h.initOptions(this.$$view, (options, resolveRenderOptions) => {
      this.setState({
        internalOptions: options,
        options: resolveRenderOptions(this.$$view.getValue()),
        optionMap: options.reduce((prev, opt) => ({ ...prev, [opt.value]: opt }), {}),
      });

      if (options.some(({ available }) => isString(available))) {
        this.on('change', value => this.setState({ options: resolveRenderOptions(value) }));
      }
    });
  }
}
