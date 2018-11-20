import { Component } from '@angular/core';
import { PdsbStorageManagerService } from 'projects/pdsb-storage-manager/src/public_api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'pdsb-storage-manager-app';

    constructor(
        private _psm: PdsbStorageManagerService
    ) {
        this._psm.set('test1', 'test1Str', true, true);
        this._psm.set('test2', {test2: 'test'}, false, true);
        this._psm.set('test3', 3, true, false);
        this._psm.set('test4', true, false, false);

        console.log(this._psm.getTheme());
        console.log(this._psm.get('test1'));
        console.log(this._psm.get('test2'));
        console.log(this._psm.get('test3'));
        console.log(this._psm.get('test4'));
    }
}
