import {
  ViewContext,
  isFunction,
  cacheDynamicEnumOptions,
  getCachedEnumOptions,
} from '@handie/runtime-core';
import {
  EnumFieldOption,
  EnumFieldOptionGetter,
  EnumField,
} from '@handie/runtime-core/dist/types/input';

function resolveEnumOptions(
  context: ViewContext,
  fieldOrFilter: EnumField,
  callback: (options: EnumFieldOption[]) => void,
): void {
  const { options } = fieldOrFilter;

  if (isFunction(options)) {
    const moduleName = context.getModuleContext().getModuleName();
    const cachedOptions = getCachedEnumOptions(moduleName, fieldOrFilter);

    if (cachedOptions) {
      callback(cachedOptions);
    } else {
      (options as EnumFieldOptionGetter)().then(({ success, data }) => {
        if (success) {
          cacheDynamicEnumOptions(moduleName, fieldOrFilter, data);
          callback(data);
        }
      });
    }
  } else {
    callback((options as EnumFieldOption[]) || []); // eslint-disable-line node/no-callback-literal
  }
}

export { resolveEnumOptions };
