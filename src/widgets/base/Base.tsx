import { Component } from 'react';

import {
  EventHandlers,
  EventHandler,
  ConfigType,
  ModuleContext,
  ViewContext,
} from '@handie/runtime-core';
import { BaseHeadlessWidget as _BaseHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { generateWidgetId, getEventWithNamespace, resolveBindEvent } from '../../utils';
import ViewReactContext from '../../contexts/view';

type WidgetBehaviors = { [key: string]: any };

export default class BaseHeadlessWidget<
  P extends Record<string, any> = {},
  S extends Record<string, any> = {},
  C extends ConfigType = ConfigType,
  H extends _BaseHeadlessWidget<P, C> = _BaseHeadlessWidget<P, C>,
  V extends ViewContext = ViewContext
> extends Component<P, S> {
  static contextType = ViewReactContext;

  private __handieReactWidgetId: string = generateWidgetId();

  private __style!: Record<string, any>;

  /**
   * Headless widget instance
   */
  protected $$_h!: H;

  /**
   * Access the injected view context
   */
  protected get $$view(): V {
    return this.context.viewContext;
  }

  /**
   * Access the injected module context
   */
  protected get $$module(): ModuleContext {
    return this.$$view.getModuleContext() as ModuleContext;
  }

  protected get config(): C {
    return this.$$_h.getConfig();
  }

  protected getBehavior(path: string): any {
    return this.$$_h.getBehavior(path);
  }

  protected getCommonBehavior(path: string, defaultBehavior?: any): any {
    return this.$$_h.getCommonBehavior(path, defaultBehavior);
  }

  protected setStyleClassNames(styleClassNames: Record<string, string>): void {
    this.__style = styleClassNames;
  }

  protected getStyleClassName(className: string): string {
    return (this.__style || {})[className] || '';
  }

  protected setup({
    headless,
    style,
    behavior,
  }: {
    headless: H;
    style?: Record<string, any>;
    behavior?: { key: string; options: WidgetBehaviors };
  }): void {
    this.$$_h = headless;

    if (style) {
      this.setStyleClassNames(style);
    }

    if (behavior) {
      this.$$_h.setBehaviors(behavior.key, behavior.options);
    }
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
