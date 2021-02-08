import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrateComponent } from './celebrate.component';

describe('CelebrateComponent', () => {
  let component: CelebrateComponent;
  let fixture: ComponentFixture<CelebrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CelebrateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CelebrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
