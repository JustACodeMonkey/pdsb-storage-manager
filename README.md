# pdsb-storage-manager
- Simple web storage manager to work with multiple apps under the same domain.
- The manager will use local / session storage if available.
- Otherwise, it will revert to using cookies.

### Information
- Items common across applications are prefixed with '/sis/', otherwise, they are prefixed with '/BASE_HREF/'.
- When using local / session storage, items set to expire use sessionStorage, otherwise, localStorage is used.
- In the case of cookies, items set to persist are appended with '/!' to signify a non-session cookie.

### Usage
- Provide the PdsbStorageManagerService in your app.module.ts file.
- Inject the service into your component, service, etc.

#### get(key: string): string 
- Returns the object stored at the given key

#### set(key: string, val: string | number | boolean | object | Array<any>, expires: boolean = true, common: boolean = false): boolean
- Sets the object by storing it in local or session storage (or to a cookie)

#### remove(key: string, track: boolean = true)
- Removes an item from either the local or session storage (or from a cookie)

#### removeAll(force: boolean = true)
- Removes all session storage items either for the app only, or for the '/common/' items as well
