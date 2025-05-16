import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNumericComponent } from './custom-numeric.component';

describe('CustomNumericComponent', () => {
  let component: CustomNumericComponent;
  let fixture: ComponentFixture<CustomNumericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomNumericComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomNumericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
