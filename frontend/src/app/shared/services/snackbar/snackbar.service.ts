import { inject, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor() {}

  private snackBar = inject(MatSnackBar);
  private injector = inject(Injector);
  private get translateService(): TranslateService {
    return this.injector.get(TranslateService);
  }

  public showSuccess(message: string, translate = true) {
    if (translate) {
      message = this.translateService.instant(message);
    }
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['success-snackbar'],
    });
  }

  public showError(message: string, translate = true) {
    if (translate) {
      message = this.translateService.instant(message);
    }
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['error-snackbar'],
    });
  }
}
