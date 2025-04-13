import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { detailsProductResolver } from './details-product.resolver';

describe('detailsProductResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => detailsProductResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
