import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const BASEURL = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.test(),
  });

  test() {
    console.log('test.....');
    return of(true);
  }

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${BASEURL}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${BASEURL}/auth/check-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((resp) => this.handleAuthSuccess(resp)),
        map(() => true),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  logout() {
    console.log('logout');
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);

    localStorage.removeItem('token');
  }

  private handleAuthSuccess(resp: AuthResponse) {
    this._user.set(resp.user);
    this._token.set(resp.token);
    this._authStatus.set('authenticated');

    localStorage.setItem('token', resp.token);
    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

  // Codigo sin refactorizar
  // login(email: string, password: string): Observable<boolean> {
  //   return this.http
  //     .post<AuthResponse>(`${BASEURL}/auth/login`, {
  //       email: email,
  //       password: password,
  //     })
  //     .pipe(
  //       tap((resp) => {
  //         this._user.set(resp.user);
  //         this._token.set(resp.token);
  //         this._authStatus.set('authenticated');

  //         localStorage.setItem('token', resp.token);
  //       }),
  //       map(() => true),
  //       catchError((error: any) => {
  //         this._authStatus.set('not-authenticated');
  //         this._user.set(null);
  //         this._token.set(null);

  //         return of(false);
  //       })
  //     );
  // }
}
