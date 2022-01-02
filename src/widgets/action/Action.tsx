import { ConfigType, getControl } from '@handie/runtime-core';
import {
  ActionWidgetState,
  IActionWidget,
  ActionHeadlessWidget as _ActionHeadlessWidget,
} from '@handie/runtime-core/dist/widgets';

import { ReactNode, JSXElementConstructor } from 'react';

import BaseHeadlessWidget from '../base/Base';

export default class ActionHeadlessWidget<
  S extends ActionWidgetState = ActionWidgetState
> extends BaseHeadlessWidget<IActionWidget, S, ConfigType, _ActionHeadlessWidget> {
  public readonly state = { disabled: false } as S;

  protected resolveContent(): ReactNode[] | string {
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
