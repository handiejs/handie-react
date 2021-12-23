import {
  ClientAction,
  ActionRendererProps,
  ActionWidgetProps,
  capitalize,
  getBehaviorByKey,
  resolveWidgetCtor,
} from '@handie/runtime-core';

import { ReactNode, JSXElementConstructor } from 'react';

import BaseRenderer from '../base';

export default class ActionRenderer extends BaseRenderer<ActionRendererProps> {
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
    ) as JSXElementConstructor<ActionWidgetProps>;

    return ActionRenderer ? <ActionWidget action={action} /> : null;
  }
}
