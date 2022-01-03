import { ActionWidgetState, omit } from '@handie/runtime-core';

import { ActionStructuralWidget } from './Action';

class IconActionStructuralWidget<
  S extends ActionWidgetState = ActionWidgetState
> extends ActionStructuralWidget<S> {
  protected resolveProps(): Record<string, any> {
    const props = omit(this.config, ['showIcon', 'iconOnly', 'icon', 'refs']);
    const classNames: string[] = ['ActionWidget', 'IconActionWidget'];

    const { icon, className } = this.config;

    if (icon) {
      props.refs = icon;
    }

    const { primary, danger } = this.props.action;

    if (primary) {
      classNames.push('IconActionWidget--primary');
    }

    if (danger) {
      classNames.push('IconActionWidget--danger');
    }

    if (className) {
      classNames.push(className);
    }

    props.className = classNames.join(' ');

    return props;
  }
}

export { IconActionStructuralWidget };
