import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export interface DeleteProductDialogData {
  title: string;
  text: string;
}

@Component({
  selector: 'app-delete-product-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule, TranslatePipe, MatDialogModule],
  templateUrl: './delete-product-confirmation-dialog.component.html',
  styleUrl: './delete-product-confirmation-dialog.component.scss',
})
export class DeleteProductConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteProductDialogData) {}
}
