import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { CreateDialogData } from '../../constants/create-dialog.constants';

@Component({
  selector: 'app-create-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.scss',
})
export class DynamicFormDialogComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateDialogData,
    public dialogRef: MatDialogRef<DynamicFormDialogComponent>
  ) {
    this.form = new FormGroup({});
    const focused = false;
    data.fields.forEach((field) => {
      this.form.addControl(field.key, new FormControl(field.initialValue ?? '', field.validators ?? []));
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
