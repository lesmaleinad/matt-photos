export enum StorageKey {
    CartItems = 'cartItems',
}

export interface LocalStorageValue {
    value: string;
    parse: () => any;
}

export const isBrowser = typeof window !== 'undefined';

export class Storage {
    public static set(key: string, value: string) {
        if (isBrowser) {
            return window.localStorage.setItem(key, value);
        }
    }

    public static get(key: string): LocalStorageValue | null {
        if (isBrowser) {
            const value = window.localStorage.getItem(key);
            if (value !== null) {
                return {
                    value: value,
                    parse: () => JSON.parse(value),
                };
            }
        }

        return null;
    }
}
