import {
  EventHandlers,
  EventHandler,
  ModuleContext,
  ViewContext,
  retrieveData,
  getBehaviorByKey,
} from '@handie/runtime-core';
import { Component } from 'react';

import { generateWidgetId, getEventWithNamespace, resolveBindEvent } from '../../utils';
import ViewReactContext from '../../contexts/view';

type WidgetBehaviors = { [key: string]: any };

export default class BaseHeadlessWidget<
  P extends Record<string, any> = {},
  S extends Record<string, any> = {},
  ViewContextType extends ViewContext = ViewContext
> extends Component<P, S> {
  static contextType = ViewReactContext;

  private __handieReactWidgetId: string = generateWidgetId();

  private behaviorKey!: string;

  private behaviors!: WidgetBehaviors;

  /**
   * Access the injected view context
   */
  protected get $$view(): ViewContextType {
    return this.context.viewContext;
  }

  /**
   * Access the injected module context
   */
  protected get $$module(): ModuleContext {
    return this.$$view.getModuleContext() as ModuleContext;
  }

  protected setBehaviors(keyInTheme: string, options: WidgetBehaviors): void {
    this.behaviorKey = keyInTheme;
    this.behaviors = options;
  }

  protected getBehavior(path: string): any {
    return getBehaviorByKey(`${this.behaviorKey}.${path}`, retrieveData(this.behaviors, path));
  }

  protected getCommonBehavior(path: string, defaultBehavior?: any): any {
    return getBehaviorByKey(`common.${path}`, defaultBehavior);
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
