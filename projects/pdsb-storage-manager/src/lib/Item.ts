/**
 * Item class
 * - Stores the required information to get / set session data
 */
export class Item {
    key: string;
    expires: boolean;
    common: boolean;

    constructor(key: string, expires: boolean = true, common: boolean = false) {
        this.key = key;
        this.expires = expires;
        this.common = common;
    }
}
