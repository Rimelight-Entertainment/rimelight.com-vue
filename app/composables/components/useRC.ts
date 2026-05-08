import { computed } from "vue";
import { defu } from "defu";

export function useRC<T extends Record<string, any>>(namespace: string, propsProp: T | undefined) {
  const appConfig = useAppConfig();

  const rc = computed(() => {
    const config = (appConfig.rimelightComponents as any) || {};
    const conf = config[namespace] || config[namespace.toLowerCase()] || {};
    return defu(propsProp || {}, conf.slots || conf);
  });

  return {
    rc,
  };
}
