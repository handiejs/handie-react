import {
  ViewContextDescriptor,
  ViewRendererProps,
  isFunction,
  getViews,
  createModuleContext,
  createView,
} from '@handie/runtime-core';

import { ReactNode, JSXElementConstructor, Component } from 'react';

import { isComponentCtor } from '../../utils';

export default class ViewRenderer extends Component<ViewRendererProps> {
  public render(): ReactNode {
    const [moduleName, resourceType, viewName] = this.props.view.split('.');
    const view = getViews(moduleName)[viewName];

    if (resourceType !== 'views' || !view) {
      return null;
    }

    const ViewWidget = createView(
      createModuleContext(moduleName),
      isFunction(view) /* && !isComponentCtor(view)*/
        ? (view as (...args: any[]) => ViewContextDescriptor)(...this.props.params)
        : (view as ViewContextDescriptor),
    ) as JSXElementConstructor<any>;

    return <ViewWidget />;
  }
}
