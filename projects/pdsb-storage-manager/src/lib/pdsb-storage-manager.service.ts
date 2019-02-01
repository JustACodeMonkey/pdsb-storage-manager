import { Injectable } from '@angular/core';

import { CookieManager } from './CookieManager';
import { Item } from './Item';
import { IManager } from './IManager';
import { StorageManager } from './StorageManager';

@Injectable({
  providedIn: 'root'
})
export class PdsbStorageManagerService {

    readonly _manager: IManager;
    readonly _OLD_THEME = 'theme';
    readonly _THEME = '/sis/' + this._OLD_THEME + '/!';

    private _items = {};
    private _themeChecked = false;
    private _tracked = new Item('psm', true, false);

    constructor() {
        this._manager = this._canUseStorage() ? new StorageManager() : new CookieManager();
        this._track();
        this._items = this._manager.get(this._tracked);
    }

    /**
     * Determines if we can use local / session storage
     * - If local/session storage is available, it will be used
     * - If not, then cookies are used
     */
    private _canUseStorage() {
        const key = 'test';
        const ls = window.localStorage;
        ls.setItem(key, 'test');
        if (ls.getItem(key)) {
            ls.removeItem(key);
            return true;
        }
        return false;
    }

    /* *********************************************************************
     * Simple methods for getting and setting the theme
     * - The theme will always be saved as a cookie
     * ********************************************************************/
    /**
     * Returns the theme
     * - When first getting the theme, it will check to see if the old theme
     *   cookie exists
     * - If so, it deletes it and writes it into the new theme cookie
     * - Otherwise, it reads the new theme cookie
     */
    getTheme() {
        if (!this._themeChecked) {
            this._themeChecked = true;
            const old = CookieManager.read(this._OLD_THEME);
            if (old) {
                CookieManager.write(this._OLD_THEME, '', true);
                CookieManager.write(this._THEME, old, false);
                return old;
            }
        }
        return CookieManager.read(this._THEME);
    }

    /**
     * Sets the theme
     * @param val string
     */
    setTheme(val: string) {
        return CookieManager.write(this._THEME, val, false);
    }

    /* *********************************************************************
     * The main service methods to get / set / remove storage items
     * - Depending on the device, local / session storage or cookies will
     *   be used
     * ********************************************************************/
    /**
     * Gets the object from session or local storage
     * @param key The key of the item to get
     */
    get(key: string): string | number | boolean | object | Array<any> {
        try {
            const item = this._items[key] || this._find(key);
            return item ? this._manager.get(item) : null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Sets the data into session or local storage
     * @param key They key of the item to store
     * @param val The value to store
     * @param expires true ? sessionStorage : localStorage
     * @param common true ? this._COMMON : this._BASE
     */
    set(key: string, val: string | number | boolean | object | Array<any>, expires: boolean = true, common: boolean = false): boolean {
        try {
            const item = new Item(key, expires, common);
            if (this._manager.set(item, val)) {
                this._items[item.key] = item;
                this._track();
            }
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Removes the data from session or local storage
     * @param key They key of the item to remove
     * @param track true ? update the tracking session : don't update
     */
    remove(key: string, track: boolean = true) {
        const item = this._items[key] || this._find(key);
        if (item) {
            try {
                if (this._manager.remove(item)) {
                    delete this._items[item.key];
                    if (track) {
                        this._track();
                    }
                }
            } catch (e) {
                return false;
            }
        }
        return true;
    }

    /**
     * Removes all expiring items from session and local storage
     * @param force true ? only /COMMON/ && /BASE_HREF/ items in session storage : only /BASE_HREF/ items in session storage
     */
    removeAll(force: boolean = false) {
        const keys = Object.keys(this._items);
        for (const key of keys) {
            const item = this._items[key];
            if (item.expires && (force || (!force && !item.common))) {
                this.remove(item.key, false);
            }
        }
        this._track();
    }

    /**
     * Uses the appropriate manager to search for an item with the provided key
     * - If an item is found, it is added to the tracker
     * @param key string
     */
    private _find(key: string) {
        const item = this._manager.find(key);
        if (item) {
            this._items[key] = item;
            this._track();
        }
        return item;
    }

    /**
     * Updates the tracking storage
     */
    private _track() {
        this._manager.set(this._tracked, this._items);
    }
}
