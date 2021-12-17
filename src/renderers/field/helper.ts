import { DataType, RenderType } from '@handie/runtime-core';
import { ViewFieldDescriptor } from '@handie/runtime-core/dist/types/input';
import { getBehaviorByKey } from '@handie/runtime-core/dist/utils/theme';

function getRenderType({ renderType, dataType = '' }: ViewFieldDescriptor): string {
  const dataTypeToRenderTypeMap: Record<DataType, RenderType> = {
    boolean: getBehaviorByKey('common.field.booleanFieldRenderType'),
    string: 'input',
    text: 'textarea',
    enum: getBehaviorByKey('common.field.enumFieldRenderType'),
    'multi-enum': 'select',
    o2o: 'select',
    o2m: 'select',
    m2m: 'select',
    m2o: 'select',
  };

  return renderType || dataTypeToRenderTypeMap[dataType] || '';
}

export { getRenderType };
