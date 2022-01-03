import {
  ActionWidgetState,
  ActionWidgetConfig,
  IActionWidget,
  getControl,
} from '@handie/runtime-core';
import { ActionHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { ReactNode, JSXElementConstructor } from 'react';

import { BaseStructuralWidget } from '../base';

class ActionStructuralWidget<
  S extends ActionWidgetState = ActionWidgetState,
  CT extends ActionWidgetConfig = ActionWidgetConfig
> extends BaseStructuralWidget<IActionWidget<CT>, S, CT, ActionHeadlessWidget<CT>> {
  public readonly state = { disabled: false } as S;

  protected renderContent(): ReactNode[] | string {
    return this.$$_h.renderContent((iconRef, text, iconOnly) => {
      const Icon = getControl('Icon') as JSXElementConstructor<any>;
      const children: ReactNode[] = [<Icon refs={iconRef} />];

      if (!iconOnly) {
        children.push(<span>{text}</span>);
      }

      return children;
    });
  }

  protected onExecute(): void {
    this.$$_h.execute(this.$$view);
  }

  public componentWillMount(): void {
    this.setHeadlessWidget(new ActionHeadlessWidget(this.props, this.$$view));

    const {
      disableWhenNoSelection = this.getCommonBehavior('action.disableWhenNoSelection', true),
    } = this.config;

    if (disableWhenNoSelection === false) {
      return;
    }

    const { context } = this.props.action;
    const batchOrBoth = context === 'batch' || context === 'both';

    this.setState({ disabled: batchOrBoth });

    if (batchOrBoth) {
      this.on('change', value =>
        this.setState({ disabled: context === 'batch' ? value.length < 2 : value.length === 0 }),
      );
    }
  }
}

export { ActionStructuralWidget };
