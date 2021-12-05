import { ListViewContext, SearchContext } from '@handie/runtime-core';

import ViewHeadlessWidget from './View';

export default class ListViewHeadlessWidget extends ViewHeadlessWidget<ListViewContext> {
  protected get $$search(): SearchContext {
    return this.context.searchContext;
  }
}
