import { ViewFieldDescriptor, ViewContext } from '@handie/runtime-core';
import {
  ViewWidgetConfig,
  ViewWidgetState,
  IViewWidget,
  ViewHeadlessWidget as _ViewHeadlessWidget,
} from '@handie/runtime-core/dist/widgets';

import BaseHeadlessWidget from '../base';

export default class ViewHeadlessWidget<
  ViewContextType extends ViewContext = ViewContext,
  S extends ViewWidgetState = ViewWidgetState,
  CT extends ViewWidgetConfig = ViewWidgetConfig,
  HW extends _ViewHeadlessWidget<CT> = _ViewHeadlessWidget<CT>
> extends BaseHeadlessWidget<IViewWidget, S, CT, HW, ViewContextType> {
  public readonly state = { loading: false } as S;

  protected get fields(): ViewFieldDescriptor[] {
    return this.$$view.getFields();
  }

  public componentWillMount(): void {
    this.on('busyChange', busy => this.setState({ loading: busy }));
  }
}
