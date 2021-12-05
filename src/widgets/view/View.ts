import {
  EventHandlers,
  EventHandler,
  ConfigType,
  ViewFieldDescriptor,
  ViewContext,
} from '@handie/runtime-core';

import { getEventWithNamespace, resolveBindEvent } from '../../utils';
import ViewReactContext from '../../contexts/view';
import BaseHeadlessWidget from '../base/Base';

export default class ViewHeadlessWidget<
  ViewContextType extends ViewContext = ViewContext
> extends BaseHeadlessWidget {
  static contextType = ViewReactContext;

  public state = {};

  constructor(props: Record<string, any>) {
    super(props);

    this.state = { loading: false };
  }

  protected get $$view(): ViewContextType {
    return this.context.viewContext;
  }

  protected get fields(): ViewFieldDescriptor[] {
    return this.$$view.getFields();
  }

  protected get config(): ConfigType {
    return this.$$view.getConfig() || {};
  }

  protected on(event: string | EventHandlers, handler?: EventHandler): void {
    this.$$view.on(resolveBindEvent(this, event), handler);
  }

  protected off(event?: string, handler?: EventHandler): void {
    this.$$view.off(getEventWithNamespace(this, event), handler);
  }

  public componentWillUnmount(): void {
    this.off();
  }
}
