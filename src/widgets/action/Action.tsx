import { ConfigType, ClientAction, isString, noop, getControl } from '@handie/runtime-core';

import { ReactNode, JSXElementConstructor } from 'react';

import BaseHeadlessWidget from '../base/Base';

interface ActionWidgetProps {
  action: ClientAction;
}

interface ActionWidgetState {
  disabled: boolean;
}

export default class ActionHeadlessWidget extends BaseHeadlessWidget<
  ActionWidgetProps,
  ActionWidgetState
> {
  public readonly state = { disabled: false } as ActionWidgetState;

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
    const { danger, confirm, text, execute } = this.props.action;

    let beforeExecute: ((callback: () => Promise<void>) => void) | undefined;

    // if (danger || confirm) {
    //   beforeExecute = callback =>
    //     MessageBox.confirm(
    //       isString(confirm) ? (confirm as string) : `确定要${text || '执行此操作'}？`,
    //       '提示',
    //       { type: 'warning' },
    //     )
    //       .then(callback)
    //       .catch(noop);
    // }

    const executeAction = async () => {
      if (execute) {
        await Promise.resolve(execute(this.$$view, this));
      }
    };

    if (beforeExecute) {
      beforeExecute(executeAction);
    } else {
      executeAction();
    }
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
