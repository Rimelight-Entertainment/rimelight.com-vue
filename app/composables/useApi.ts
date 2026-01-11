import type { UseFetchOptions } from '#app';
import { hash } from 'ohash';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

/**
 * $api: For imperative calls (buttons, save actions, Pinia Colada)
 */
export const $api = async <T>(path: string, opts: any = {}) => {
    const config = useRuntimeConfig();
    const isTauri = config.public.isTauri as boolean;
    const isExternal = isTauri || (import.meta.env.PROD && import.meta.client && !window.location.hostname.includes('rimelight.com'));

    const baseURL = isExternal ? (config.public.apiBase as string) : '';

    return $fetch<T>(path, {
        baseURL,
        ...opts,
        fetch: isTauri ? tauriFetch : undefined,
        headers: {
            Accept: 'application/json',
            ...opts.headers,
        },
        credentials: 'include',
    });
};

/**
 * useApi: For reactive data fetching in setup
 */
export const useApi = <T>(path: string | (() => string), opts: UseFetchOptions<T> = {}) => {
    const config = useRuntimeConfig();
    const isTauri = config.public.isTauri as boolean;
    const isExternal = isTauri || (import.meta.env.PROD && import.meta.client && !window.location.hostname.includes('rimelight.com'));

    return useFetch(path, {
        baseURL: isExternal ? (config.public.apiBase as string) : '',
        ...opts,
        fetch: isTauri ? tauriFetch : undefined,
        // Key ensures unique state tracking in Nuxt
        key: opts.key || hash([path, typeof path === 'function' ? path() : path]),
    } as UseFetchOptions<T> & { fetch?: unknown });
};