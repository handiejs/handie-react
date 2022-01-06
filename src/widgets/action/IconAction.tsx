import { ReactNode } from 'react';
import { ActionWidgetState, omit, getControl } from '@handie/runtime-core';

import { ComponentCtor } from '../../types/component';

import { resolveControlProps } from './helper';
import { ActionStructuralWidget } from './Action';

class IconActionStructuralWidget<
  S extends ActionWidgetState = ActionWidgetState
> extends ActionStructuralWidget<S> {
  protected resolveProps(): Record<string, any> {
    const props: Record<string, any> = {};

    if (this.config.icon) {
      props.refs = this.config.icon;
    }

    return props;
  }

  protected renderIcon(props: Record<string, any> = {}): ReactNode {
    const Icon = getControl('Icon') as ComponentCtor;

    return Icon ? <Icon {...resolveControlProps(this.resolveProps(), props)} /> : null;
  }
}

export { IconActionStructuralWidget };
