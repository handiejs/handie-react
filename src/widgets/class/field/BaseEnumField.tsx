import { EnumFieldWidgetConfig, EnumFieldWidgetState, isString } from '@handie/runtime-core';
import { EnumFieldHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FieldStructuralWidget } from './Field';

class BaseEnumFieldStructuralWidget<
  ValueType,
  S extends EnumFieldWidgetState = EnumFieldWidgetState,
  CT extends EnumFieldWidgetConfig = EnumFieldWidgetConfig
> extends FieldStructuralWidget<ValueType, CT, EnumFieldHeadlessWidget<ValueType, CT>, S> {
  public readonly state = {
    internalOptions: [],
    options: [],
    optionMap: {},
  } as any;

  public componentWillMount(): void {
    this.setHeadlessWidget(new EnumFieldHeadlessWidget(this.props, this.$$view));

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

export { BaseEnumFieldStructuralWidget };
