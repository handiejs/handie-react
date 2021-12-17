import { getBehaviorByKey } from '@handie/runtime-core/dist/utils/theme';

function resolveFieldBehavior(config: Record<string, any>, key: string, defaultBehavior: any): any {
  return config[key] === undefined
    ? getBehaviorByKey(`common.field.${key}`, defaultBehavior)
    : config[key];
}

export { resolveFieldBehavior };
