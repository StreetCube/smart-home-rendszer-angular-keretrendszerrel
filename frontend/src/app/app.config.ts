import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './features/auth/services/auth.service';
import { apiPrefixInterceptor } from './shared/interceptors/api-prefix/api-prefix.interceptor';
import { errorInterceptor } from './shared/interceptors/error/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([apiPrefixInterceptor, errorInterceptor])),
    provideRouter(routes),
    // New Angular 19+ app initializer pattern
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.checkAuthState();
    }),
  ],
};
