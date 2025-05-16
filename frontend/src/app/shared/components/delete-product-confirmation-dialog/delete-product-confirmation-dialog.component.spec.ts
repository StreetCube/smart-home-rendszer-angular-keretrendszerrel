import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProductConfirmationDialogComponent } from './delete-product-confirmation-dialog.component';

describe('DeleteProductConfirmationDialogComponent', () => {
  let component: DeleteProductConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteProductConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProductConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteProductConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
