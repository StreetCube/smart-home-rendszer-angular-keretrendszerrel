import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { AuthService } from './features/auth/services/auth.service';
import { apiPrefixInterceptor } from './shared/interceptors/api-prefix/api-prefix.interceptor';
import { errorInterceptor } from './shared/interceptors/error/error.interceptor';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([apiPrefixInterceptor, errorInterceptor])),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    provideRouter(routes),
    // New Angular 19+ app initializer pattern
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.checkAuthState();
    }),
  ],
};
