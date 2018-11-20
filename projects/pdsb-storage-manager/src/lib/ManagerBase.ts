import { Item } from './Item';

/**
 * The ManagerBase class is used by both the StorageManager and CookieManager
 * - It determines the applications base HREF and sets the common reference
 *   for items that are used by multiple applications
 * - It has the logic to build a path from an Item's key ... The path consists
 *   of a base (either the common or app base) appended to the key
 */
export class ManagerBase {

    private _BASE: string;      // The base URL for the app
    private _COMMON = '/sis/';  // The common URL for the app

    /**
     * Determines the applications base HREF and initialized the _tracker Item
     */
    constructor() {
        // Set the base for app-specific keys
        const bases = document.getElementsByTagName('base');
        if (bases.length > 0) {
            this._BASE = bases[0].attributes['href'].nodeValue as string;
        } else {
            this._BASE = '/';
        }
    }

    /**
     * Returns the path for the specific item
     * @param item Item
     */
    protected _path(item: Item) {
        return (item.common ? this._COMMON : this._BASE) + item.key;
    }

    /**
     * Returns the path for the key / common combination
     * @param key string
     * @param common boolean
     */
    protected _pathFromKey(key: string, common: boolean) {
        return (common ? this._COMMON : this._BASE) + key;
    }
}
