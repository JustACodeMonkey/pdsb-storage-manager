import { TestBed } from '@angular/core/testing';

import { PdsbStorageManagerService } from './pdsb-storage-manager.service';

describe('PdsbStorageManagerService', () => {

    let service: PdsbStorageManagerService;

    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        service = TestBed.get(PdsbStorageManagerService);
        expect(service).toBeTruthy();
    });

    it('should be null', () => {
        const key = 'thisIsNotAStoredValue';
        expect(service.get(key)).toBeNull();
    });

    it('should set and get a stored value', () => {
        const key = 'test';
        const val = 'test';
        service.set(key, val, true, false);
        expect(service.get(key)).toBe(val);
    });

    it('should remove the stored value', () => {
        const key = 'test';
        service.remove(key);
        expect(service.get(key)).toBeNull();
    });
});
