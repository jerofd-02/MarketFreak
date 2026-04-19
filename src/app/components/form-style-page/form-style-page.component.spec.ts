import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStylePageComponent } from './form-style-page.component';

describe('FormStylePageComponent', () => {
  let component: FormStylePageComponent;
  let fixture: ComponentFixture<FormStylePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStylePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormStylePageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
