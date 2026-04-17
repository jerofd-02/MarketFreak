import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PhotoRow} from './photo-row.component';

describe('PhotoRow', () => {
  let component: PhotoRow;
  let fixture: ComponentFixture<PhotoRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoRow],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
