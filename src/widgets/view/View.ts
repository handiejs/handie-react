import { ViewContext } from '@handie/runtime-core';

import ViewReactContext from '../../contexts/view';
import BaseHeadlessWidget from '../base/Base';

export default class ViewHeadlessWidget<
  ViewContextType extends ViewContext = ViewContext
> extends BaseHeadlessWidget {
  static contextType = ViewReactContext;

  protected get $$view(): ViewContextType {
    return this.context.viewContext;
  }
}
