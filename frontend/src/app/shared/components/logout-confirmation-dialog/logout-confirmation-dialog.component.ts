import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './logout-confirmation-dialog.component.html',
  styleUrl: './logout-confirmation-dialog.component.scss',
})
export class LogoutConfirmationDialogComponent {}
