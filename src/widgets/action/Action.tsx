import {
  ConfigType,
  ActionWidgetProps,
  ActionWidgetState,
  getControl,
  executeClientAction,
} from '@handie/runtime-core';

import { ReactNode, JSXElementConstructor } from 'react';

import BaseHeadlessWidget from '../base/Base';

export default class ActionHeadlessWidget<
  S extends ActionWidgetState = ActionWidgetState
> extends BaseHeadlessWidget<ActionWidgetProps, S> {
  public readonly state = { disabled: false } as S;

  protected get config(): ConfigType {
    return this.props.action.config || {};
  }

  protected resolveContent(): ReactNode[] | string {
    const text = this.props.action.text || '';

    let { showIcon, iconOnly, icon } = this.config;

    if (showIcon === undefined) {
      showIcon = this.getCommonBehavior('action.showIcon');
    }

    if (iconOnly === undefined) {
      iconOnly = this.getCommonBehavior('action.iconOnly');
    }

    if (!showIcon || !icon) {
      return text;
    }

    const Icon = getControl('Icon') as JSXElementConstructor<any>;
    const children: ReactNode[] = [<Icon refs={icon} />];

    if (!iconOnly) {
      children.push(<span>{text}</span>);
    }

    return children;
  }

  protected onExecute(): void {
    executeClientAction(this.$$view, this.props.action);
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
