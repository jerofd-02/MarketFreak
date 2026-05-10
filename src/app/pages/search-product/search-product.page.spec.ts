import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProductPage } from './search-product.page';

describe('SearchProductPage', () => {
  let component: SearchProductPage;
  let fixture: ComponentFixture<SearchProductPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchProductPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchProductPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
