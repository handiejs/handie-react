import { ListViewContext, isFunction, getWidget } from '@handie/runtime-core';

import { ReactNode, JSXElementConstructor } from 'react';

import BaseRenderer from '../base';

export default class SearchRenderer extends BaseRenderer {
  public render(): ReactNode {
    const search = (this.$$view as ListViewContext).getSearch();

    let SearchWidget: JSXElementConstructor<any>;

    if (isFunction(search)) {
      SearchWidget = search as JSXElementConstructor<any>;
    } else {
      const { widget = 'FormSearchWidget' } = search as any;

      SearchWidget = isFunction(widget) ? widget : getWidget(widget);
    }

    return SearchWidget ? <SearchWidget /> : null;
  }
}
