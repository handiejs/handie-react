import {
  ClientAction,
  capitalize,
  getBehaviorByKey,
  resolveWidgetCtor,
} from '@handie/runtime-core';

import { ReactNode, JSXElementConstructor } from 'react';

import BaseRenderer from '../base';

export default class ActionRenderer extends BaseRenderer<{
  action: ClientAction;
}> {
  public render(): ReactNode {
    const { action } = this.props;

    if (!action) {
      return null;
    }

    const ActionWidget = resolveWidgetCtor(
      this.$$view.getModuleContext(),
      action.widget,
      () =>
        `${capitalize(
          action.renderType || getBehaviorByKey('common.action.renderType') || '',
        )}ActionWidget`,
    ) as JSXElementConstructor<{ action: ClientAction }>;

    return ActionRenderer ? <ActionWidget action={action} /> : null;
  }
}
