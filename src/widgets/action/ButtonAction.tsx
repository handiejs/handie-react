import { ReactNode } from 'react';
import { ActionWidgetState, getControl } from '@handie/runtime-core';

import { ComponentCtor } from '../../types/component';
import { ButtonActionWidgetConfig } from '../../types/widget';

import { resolveControlProps } from './helper';
import { ActionStructuralWidget } from './Action';

class ButtonActionStructuralWidget<
  S extends ActionWidgetState = ActionWidgetState,
  C extends ButtonActionWidgetConfig = ButtonActionWidgetConfig
> extends ActionStructuralWidget<S, C> {
  protected resolveProps(): Record<string, any> {
    const { primary, danger } = this.props.action;
    const props: Record<string, any> = { disabled: this.state.disabled };

    if (this.config.size) {
      props.size = this.config.size;
    }

    if (primary) {
      props.color = 'primary';
    }

    if (danger) {
      props.color = 'danger';
    }

    return props;
  }

  protected renderButton(props: Record<string, any> = {}): ReactNode {
    const Button = getControl('Button') as ComponentCtor;

    return Button ? (
      <Button {...resolveControlProps(this.resolveProps(), props)}>{this.renderContent()}</Button>
    ) : null;
  }
}

export { ButtonActionStructuralWidget };
