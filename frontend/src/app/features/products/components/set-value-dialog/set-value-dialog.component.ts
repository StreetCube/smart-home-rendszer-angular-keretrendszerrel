import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-set-value-dialog',
  template: `
    <h2 mat-dialog-title>{{ 'create.product.set_value' | translate }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width: 100%; margin-top: 8px">
        <mat-label>{{ 'create.product.value' | translate }}</mat-label>
        <input matInput type="number" [(ngModel)]="data.value" [min]="data.min" [max]="data.max" [step]="data.step" />
        @if (data.unit) {
        <span matSuffix>{{ data.unit }}</span>
        }
      </mat-form-field>
      <div class="limits" *ngIf="data.min !== undefined || data.max !== undefined">
        @if (data.min !== undefined) {
        <span class="limit"
          >Min: <b>{{ data.min }}</b></span
        >
        } @if (data.max !== undefined) {
        <span class="limit"
          >Max: <b>{{ data.max }}</b></span
        >
        }
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-button color="primary" (click)="dialogRef.close(data.value)">OK</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, NgIf, TranslatePipe],
  styles: [
    `
      .limits {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        margin-top: 8px;
        color: #666;
        font-size: 0.95em;
      }
      .limit b {
        color: #222;
      }
    `,
  ],
})
export class SetValueDialogComponent {
  constructor(public dialogRef: MatDialogRef<SetValueDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
}
