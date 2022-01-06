import { FilterHeadlessWidget } from '@handie/runtime-core/dist/widgets';

import { FilterStructuralWidget } from './Filter';

class StringFilterStructuralWidget extends FilterStructuralWidget<string> {
  public componentWillMount(): void {
    this.setHeadlessWidget(new FilterHeadlessWidget(this.props, this.$$view));
  }
}

export { StringFilterStructuralWidget };
