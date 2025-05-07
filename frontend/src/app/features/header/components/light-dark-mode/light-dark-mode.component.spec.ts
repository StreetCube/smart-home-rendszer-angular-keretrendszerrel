import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightDarkModeComponent } from './light-dark-mode.component';

describe('LightDarkModeComponent', () => {
  let component: LightDarkModeComponent;
  let fixture: ComponentFixture<LightDarkModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightDarkModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightDarkModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
