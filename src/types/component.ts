import { ComponentDescriptor as _ComponentDescriptor } from '@handie/runtime-core';
import { JSXElementConstructor } from 'react';

type ComponentCtor<P extends Record<string, any> = any> = JSXElementConstructor<P>;

interface ComponentDescriptor extends _ComponentDescriptor {
  ctor: ComponentCtor;
}

export { ComponentCtor, ComponentDescriptor };
