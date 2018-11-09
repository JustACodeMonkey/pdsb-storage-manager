import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdsbStorageManagerService {

    readonly _ls = window.localStorage;
    readonly _ss = window.sessionStorage;

    private _BASE: string;
    private _COMMON = '/common/';
    private _PSM: string;

    private _items = {};

    constructor() {
        // Set the base for app-specific keys
        const bases = document.getElementsByTagName('base');
        if (bases.length > 0) {
            this._BASE = bases[0].attributes['href'].nodeValue as string;
        } else {
            this._BASE = '/';
        }
        // Get this app's keys
        this._PSM = this._BASE + 'psm';
        this._items = <Item[]>JSON.parse(this._ss.getItem(this._PSM)) || {};
    }

    /**
     * Gets the object from session or local storage
     * @param key The key of the item to get
     */
    get(key: string): string | number | boolean | object | Array<any> {
        try {
            const item = this._items[key] || this._find(key);
            const path = this._path(item.key, item.common);
            const val = this._storage(item).getItem(path) || null;
            return JSON.parse(val);
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
            const path = this._path(key, common);
            const item = new Item(key, expires, common);
            const json = JSON.stringify(val);
            this._items[item.key] = item;
            this._storage(item).setItem(path, json);
            this._track();
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
        const item = this._items[key];
        const path = this._path(item.key, item.common);
        if (item) {
            try {
                this._storage(item).removeItem(path);
                delete this._items[item.key];
            } catch (e) {
                return false;
            }
            if (track) {
                this._track();
            }
        }
        return true;
    }

    /**
     * Removes all expiring items from session and local storage
     * @param force true ? only /COMMON/ && /BASE_HREF/ items in session storage : only /BASE_HREF/ items in session storage
     */
    removeAll(force: boolean = false) {
        for (const key of Object.keys(this._items)) {
            const item = this._items[key];
            if (item.expires && (force || (!force && !item.common))) {
                this.remove(item.key, false);
            }
        }
        this._track();
        if (Object.keys(this._items).length === 0) {
            this._ss.removeItem(this._PSM);
        }
    }

    /**
     * Attemps to find a stored item in either session or local storage
     * - This will get called when the get method is not able to find
     *   the key in this._items (likely to happen when a app that opens
     *   in a pop-up is trying to access the token)
     * - If a key is found, it will add itslef to this apps session
     *   manager list
     * @param key The name of the key to find
     */
    private _find(key: string) {
        const commonPath = this._path(key, true);
        const appPath = this._path(key, false);
        let item: Item;
        if (this._ss[commonPath]) {
            item = new Item(key, true, true);
        } else if (this._ss[appPath]) {
            item = new Item(key, true, false);
        } else if (this._ls[commonPath]) {
            item = new Item(key, false, true);
        } else if (this._ls[appPath]) {
            item = new Item(key, false, false);
        }
        if (item) {
            this._items[key] = item;
            this._track();
        }
        return item;
    }

    /**
     * Sets the item's path
     * @param key They key for the item
     * @param common true ? use common base : use app base
     */
    private _path(key: string, common: boolean) {
        return (common ? this._COMMON : this._BASE) + key;
    }

    /**
     * Returns the storage method for the item
     * @param item The item to use to determine the storage method
     */
    private _storage(item: Item): Storage {
        return item.expires ? this._ss : this._ls;
    }

    /**
     * Tracks the items by creating a session
     */
    private _track() {
        this._ss.setItem(this._PSM, JSON.stringify(this._items));
    }
}

/**
 * Item class
 * - Stores the required information to get / set session data
 */
class Item {
    key: string;
    expires: boolean;
    common: boolean;

    constructor(key: string, expires: boolean = true, common: boolean = false) {
        this.key = key;
        this.expires = expires;
        this.common = common;
    }
}
