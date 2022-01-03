import { ActionWidgetState, omit } from '@handie/runtime-core';

import { ActionStructuralWidget } from './Action';

class LinkActionStructuralWidget<
  S extends ActionWidgetState = ActionWidgetState
> extends ActionStructuralWidget<S> {
  protected resolveProps(): Record<string, any> {
    const classNames: string[] = ['ActionWidget', 'LinkActionWidget'];

    if (this.config.className) {
      classNames.push(this.config.className);
    }

    const props = omit(this.config, ['showIcon', 'iconOnly', 'icon']);

    props.className = classNames.join(' ');

    return props;
  }
}

export { LinkActionStructuralWidget };
