import { Component, effect, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { NumericExpose } from '../../types/Product';
import { SetValueDialogComponent } from '../set-value-dialog/set-value-dialog.component';

@Component({
  selector: 'app-custom-numeric',
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, TranslatePipe],
  templateUrl: './custom-numeric.component.html',
  styleUrl: './custom-numeric.component.scss',
})
export class CustomNumericComponent implements OnInit {
  public numericExposed = input.required<NumericExpose>();
  public access = input.required<number>();
  public value = input.required<number>();
  public currentValue: number | null = null;
  public settable = false;

  @Output() valueChanged = new EventEmitter<number | null>();
  private dialog = inject(MatDialog);
  constructor() {
    effect(() => {
      if (this.access() === 7) {
        this.settable = true;
      } else {
        this.settable = false;
      }
    });
  }

  ngOnInit(): void {
    this.currentValue = this.value();
  }

  openSetValueDialog() {
    const dialogRef = this.dialog.open(SetValueDialogComponent, {
      data: {
        currentValue: this.currentValue,
        max: this.numericExposed().value_max,
        min: this.numericExposed().value_min,
        step: this.numericExposed().value_step,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.currentValue = result;
        this.valueChanged.emit(this.currentValue);
      }
    });
  }
}
