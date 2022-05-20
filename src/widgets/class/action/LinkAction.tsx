import { ReactNode } from 'react';
import { ActionWidgetState, omit, getControl } from '@handie/runtime-core';

import { ComponentCtor } from '../../../types/component';

import { resolveControlProps } from './helper';
import { ActionStructuralWidget } from './Action';

class LinkActionStructuralWidget<
  S extends ActionWidgetState = ActionWidgetState
> extends ActionStructuralWidget<S> {
  protected resolveProps(): Record<string, any> {
    return omit(this.config, ['showIcon', 'iconOnly', 'icon']);
  }

  protected renderLink(props: Record<string, any> = {}): ReactNode {
    const Link = getControl('Link') as ComponentCtor;

    return (
      <>
        {Link ? (
          <Link {...resolveControlProps(this.resolveProps(), props)}>{this.renderContent()}</Link>
        ) : null}
        {this.renderView()}
      </>
    );
  }
}

export { LinkActionStructuralWidget };
