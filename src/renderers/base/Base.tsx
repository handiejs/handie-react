import { ViewContext } from '@handie/runtime-core';

import { Component } from 'react';

import ViewReactContext from '../../contexts/view';

export default class BaseRenderer<
  P extends Record<string, any> = {},
  S extends Record<string, any> = {}
> extends Component<P, S> {
  static contextType = ViewReactContext;

  protected get $$view(): ViewContext {
    return this.context.viewContext;
  }
}
