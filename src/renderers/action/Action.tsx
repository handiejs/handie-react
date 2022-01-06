import {
  ActionRendererProps,
  IActionWidget,
  toPascalCase,
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
        `${toPascalCase(
          action.renderType || getBehaviorByKey('common.action.renderType') || '',
        )}ActionWidget`,
    ) as JSXElementConstructor<IActionWidget>;

    return ActionRenderer ? <ActionWidget action={action} /> : null;
  }
}
