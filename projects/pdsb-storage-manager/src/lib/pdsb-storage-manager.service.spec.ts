import { TestBed } from '@angular/core/testing';

import { PdsbStorageManagerService } from './pdsb-storage-manager.service';

describe('PdsbStorageManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdsbStorageManagerService = TestBed.get(PdsbStorageManagerService);
    expect(service).toBeTruthy();
  });
});
