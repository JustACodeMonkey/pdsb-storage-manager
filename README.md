# pdsb-storage-manager
Simple web storage manager to work with multiple apps under the same domain.

## Information
Items set to expire use sessionStorage, otherwise, localStorage is used.
Items common across applications are prefixed with '/common/', otherwise, they are prefixed with '/BASE_HREF/'.

## Usage
Provide the PdsbStorageManagerService in your app.module.ts file
Inject the service into your component, service, etc.

### get(key: string): string 
Returns the object stored at the given key

### set(key: string, val: string | number | boolean | object | Array<any>, expires: boolean = true, common: boolean = false): boolean
Sets the object by storing it in local or session storage

### remove(key: string, track: boolean = true)
Removes an item from either the local or session storage

### removeAll(appOnly: boolean = true)
Removes all session storage items either for the app only, or for the '/common/' items as well
