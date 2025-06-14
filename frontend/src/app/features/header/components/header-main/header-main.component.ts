import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LogoutConfirmationDialogComponent } from '../../../../shared/components/logout-confirmation-dialog/logout-confirmation-dialog.component';
import { ResponsiveService } from '../../../../shared/services/responsive/responsive.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header-main',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, MatDialogModule, AsyncPipe, TranslatePipe],
  templateUrl: './header-main.component.html',
  styleUrl: './header-main.component.scss',
})
export class HeaderMainComponent {
  public authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  public responsiveService = inject(ResponsiveService);

  logout() {
    const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'yes') {
        await this.authService.logout();
        this.router.navigate(['auth/login']);
      }
    });
  }
}
