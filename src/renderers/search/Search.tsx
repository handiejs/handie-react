import {ListViewContext,isFunction,getWidget} from '@handie/runtime-core';

import { ReactNode,JSXElementConstructor,Component } from 'react';

import ViewReactContext from '../../contexts/view';

export default class SearchRenderer extends Component {
  static contextType = ViewReactContext;

  private get $$view():ListViewContext {
    return this.context.viewContext;
  }

  public render():ReactNode {
    const search = this.$$view.getSearch();

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
