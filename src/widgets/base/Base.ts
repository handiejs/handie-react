import {
  EventWithNamespace,
  EventHandler,
  EventHandlers,
  isString,
  retrieveData,
  getBehaviorByKey,
} from '@handie/runtime-core';
import { Component } from 'react';

type WidgetBehaviors = { [key: string]: any };

function getEventWithNamespace(vm: any, event: string = ''): EventWithNamespace {
  return `${event}.vue_inst_${vm._uid}`;
}

function resolveBindEvent(
  vm: any,
  event: string | EventHandlers,
): EventWithNamespace | EventHandlers {
  let resolved: EventWithNamespace | EventHandlers;

  if (isString(event)) {
    resolved = getEventWithNamespace(vm, event as string);
  } else {
    resolved = {} as EventHandlers;

    Object.keys(event as EventHandlers).forEach(key => {
      resolved[getEventWithNamespace(vm, key)] = (event as EventHandlers)[key];
    });
  }

  return resolved;
}

export default class BaseHeadlessWidget extends Component {
  private behaviorKey!: string;

  private behaviors!: WidgetBehaviors;

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
    if ((this as any).context) {
      (this as any).context.on(resolveBindEvent(this, event), handler);
    }
  }

  protected off(event?: string, handler?: EventHandler): void {
    if ((this as any).context) {
      (this as any).context.off(getEventWithNamespace(this, event), handler);
    }
  }

  protected beforeDestroy(): void {
    this.off();
  }
}
