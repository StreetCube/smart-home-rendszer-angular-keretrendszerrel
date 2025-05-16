import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetValueDialogComponent } from './set-value-dialog.component';

describe('SetValueDialogComponent', () => {
  let component: SetValueDialogComponent;
  let fixture: ComponentFixture<SetValueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetValueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetValueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
