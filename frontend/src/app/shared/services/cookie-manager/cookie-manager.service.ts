import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookieManagerService {
  private readonly CLIENT_COOKIE = 'user_session';
  constructor() {}
  private cookieService = inject(CookieService);
  private http = inject(HttpClient);

  public setLoginState(): void {
    this.cookieService.set(this.CLIENT_COOKIE, 'true', {
      expires: 1,
      sameSite: 'Lax',
      secure: true,
    });
  }

  public clearAuthState(): void {
    this.cookieService.delete(this.CLIENT_COOKIE, undefined, undefined, true, 'Lax');
  }
}
