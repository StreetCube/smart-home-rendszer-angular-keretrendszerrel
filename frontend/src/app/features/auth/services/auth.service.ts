import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { catchError, firstValueFrom, Observable, of, tap } from 'rxjs';
import { RouteConstants } from '../../../shared/route.constants';
import { CookieManagerService } from '../../../shared/services/cookie-manager/cookie-manager.service';
import { GeneralHttpResponse } from '../../../shared/types/generalHttpResponse';
import { UserAfterCreate, UserToRegister } from '../types/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    effect(() => {
      if (this.isAuthenticated()) {
        this.cookieManagerService.setLoginState();
      } else {
        this.cookieManagerService.clearAuthState();
      }
      console.log(this.user());
    });
  }

  public user = signal<UserAfterCreate | null>(null);
  public isAuthenticated = computed(() => !!this.user());

  private http = inject(HttpClient);
  private cookieManagerService = inject(CookieManagerService);
  public isLogin = true;

  public login(userData: { username: string; password: string }): Observable<GeneralHttpResponse<'login'>> {
    return this.http.post<GeneralHttpResponse<'login'>>(RouteConstants.AUTH.LOGIN, { ...userData }).pipe(
      tap((response) => {
        if (response.data) {
          this.user.set(response.data);
          console.log(this.user());
        }
      }),
      catchError((error: GeneralHttpResponse<'login'>) => {
        return of(error);
      })
    );
  }

  public register(userData: UserToRegister): Observable<GeneralHttpResponse<'register'>> {
    return this.http.post<GeneralHttpResponse<'register'>>(RouteConstants.CRUD.CREATE('User'), { ...userData }).pipe(
      tap((response) => {
        if (response.data) {
          this.user.set(response.data);
        }
      }),
      catchError((error: GeneralHttpResponse<'register'>) => {
        return of(error);
      })
    );
  }

  public async checkAuthState(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<GeneralHttpResponse<'status'>>(RouteConstants.AUTH.STATUS).pipe(
          catchError((error: GeneralHttpResponse<'status'>) => {
            return of(error);
          })
        )
      );
      if (response?.data?.isAuthenticated) {
        this.user.set(response.data);
      } else {
        this.user.set(null);
      }
    } catch (error) {}
  }

  public async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post<GeneralHttpResponse<'logout'>>(RouteConstants.AUTH.LOGOUT, {}));
      this.user.set(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
