import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-logout-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  templateUrl: './logout-confirmation-dialog.component.html',
  styleUrl: './logout-confirmation-dialog.component.scss',
})
export class LogoutConfirmationDialogComponent {}
