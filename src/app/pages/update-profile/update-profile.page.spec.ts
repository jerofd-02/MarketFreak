import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateProfilePage} from './update-profile.page';

describe('UpdateProfilePage', () => {
  let component: UpdateProfilePage;
  let fixture: ComponentFixture<UpdateProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfilePage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpdateProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
