import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';
import { RouteConstants } from '../../route.constants';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { AuthCustomCode, GeneralHttpResponse } from '../../types/generalHttpResponse';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const snackbarService = inject(SnackbarService);
  const router = inject(Router);

  if (req.url.includes(RouteConstants.AUTH.STATUS)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: GeneralHttpResponse<'all'>) => {
      if (
        (authService.isAuthenticated() && error.error.code === AuthCustomCode.NO_TOKEN_FOUND) ||
        error.error.code === AuthCustomCode.INVALID_TOKEN
      ) {
        snackbarService.showError('Session expired. Please log in again.');
        authService.logout();
        router.navigate(['/auth/login']);
      } else {
        console.error('An unknown error occurred:', error);
      }
      return throwError(() => error);
    })
  );
};
