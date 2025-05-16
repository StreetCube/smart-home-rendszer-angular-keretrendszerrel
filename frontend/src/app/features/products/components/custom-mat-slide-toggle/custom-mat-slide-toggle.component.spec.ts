import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMatSlideToggleComponent } from './custom-mat-slide-toggle.component';

describe('CustomMatSlideToggleComponent', () => {
  let component: CustomMatSlideToggleComponent;
  let fixture: ComponentFixture<CustomMatSlideToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomMatSlideToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomMatSlideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
