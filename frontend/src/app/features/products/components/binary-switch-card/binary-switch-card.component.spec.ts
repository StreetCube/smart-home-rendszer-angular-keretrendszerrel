import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinarySwitchCardComponent } from './binary-switch-card.component';

describe('BinarySwitchCardComponent', () => {
  let component: BinarySwitchCardComponent;
  let fixture: ComponentFixture<BinarySwitchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BinarySwitchCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BinarySwitchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
