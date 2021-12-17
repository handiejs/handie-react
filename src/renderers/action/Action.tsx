import {
  ClientAction,
  ViewContext,
  capitalize,
  getBehaviorByKey,
  resolveWidgetCtor,
} from '@handie/runtime-core';

import { ReactNode, JSXElementConstructor, Component } from 'react';

import ViewReactContext from '../../contexts/view';

export default class ActionRenderer extends Component<{ action: ClientAction }> {
  static contextType = ViewReactContext;

  private get $$view():ViewContext {
    return this.context.viewContext;
  }

  public render(): ReactNode {
    const { action } = this.props;

    if (!action) {
      return null;
    }

    const ActionWidget = resolveWidgetCtor(
      this.$$view.getModuleContext(),
      action.widget,
      () => `${capitalize(action.renderType || getBehaviorByKey('common.action.renderType') || '')}ActionWidget`,
    ) as JSXElementConstructor<{ action: ClientAction }>;

    return ActionRenderer ? <ActionWidget action={ action } /> : null;
  }
}
