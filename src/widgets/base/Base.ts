import { retrieveData, getBehaviorByKey } from '@handie/runtime-core';
import { Component } from 'react';

import { generateWidgetId } from '../../utils';

type WidgetBehaviors = { [key: string]: any };

export default class BaseHeadlessWidget extends Component {
  private __handieReactWidgetId: string = generateWidgetId();

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
}
