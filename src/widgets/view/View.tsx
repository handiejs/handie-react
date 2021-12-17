import { ConfigType, ViewFieldDescriptor, ViewContext } from '@handie/runtime-core';

import BaseHeadlessWidget from '../base/Base';

export interface ViewWidgetState {
  loading: boolean;
}

export default class ViewHeadlessWidget<
  ViewContextType extends ViewContext = ViewContext,
  S extends ViewWidgetState = ViewWidgetState
> extends BaseHeadlessWidget<{}, S, ViewContextType> {
  public readonly state = { loading: false } as S;

  protected get fields(): ViewFieldDescriptor[] {
    return this.$$view.getFields();
  }

  protected get config(): ConfigType {
    return this.$$view.getConfig() || {};
  }
}
