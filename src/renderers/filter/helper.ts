import { DataType, RenderType } from '@handie/runtime-core';
import { FilterDescriptor } from '@handie/runtime-core/dist/types/input';

const dataTypeToRenderTypeMap: Record<DataType, RenderType> = {
  boolean: 'select',
  string: 'input',
  text: 'input',
  enum: 'select',
  'multi-enum': 'select',
  o2o: 'select',
  o2m: 'select',
  m2m: 'select',
  m2o: 'select',
};

function getRenderType({ renderType, dataType = '' }: FilterDescriptor): string {
  return renderType || dataTypeToRenderTypeMap[dataType] || '';
}

export { getRenderType };
