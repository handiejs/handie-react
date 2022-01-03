import { ActionWidgetState } from '@handie/runtime-core';

import { ButtonActionWidgetConfig } from '../../types/widget';
import { ActionStructuralWidget } from './Action';

class ButtonActionStructuralWidget<
  S extends ActionWidgetState = ActionWidgetState,
  C extends ButtonActionWidgetConfig = ButtonActionWidgetConfig
> extends ActionStructuralWidget<S, C> {
  protected resolveProps(): Record<string, any> {
    const { primary, danger } = this.props.action;

    const classNames: string[] = ['ActionWidget', 'ButtonActionWidget'];

    if (this.config.className) {
      classNames.push(this.config.className);
    }

    const props: Record<string, any> = {
      className: classNames.join(' '),
      disabled: this.state.disabled,
    };

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
}

export { ButtonActionStructuralWidget };
