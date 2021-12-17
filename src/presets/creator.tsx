import { setViewCreator } from '@handie/runtime-core';
import { Component, JSXElementConstructor } from 'react';

import ViewReactContext from '../contexts/view';

setViewCreator((context, provider, renderer) => {
  const DynamicRenderer = renderer as JSXElementConstructor<Record<string, any>>;

  class ViewEntry extends Component {
    render() {
      return (
        <ViewReactContext.Provider value={provider}>
          {DynamicRenderer ? <DynamicRenderer /> : null}
        </ViewReactContext.Provider>
      );
    }
  }

  (ViewEntry as any).displayName = context.getView().name;

  return ViewEntry;
});
