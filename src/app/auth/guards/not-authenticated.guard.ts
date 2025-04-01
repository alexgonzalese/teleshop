import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async(
  route: Route,
  segments: UrlSegment[]
) => {
  // console.log('NotAuthenticatedGuard');
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkStatus());
  //  console.log('isAuthenticated', isAuthenticated);

  if (isAuthenticated) {
    router.navigate(['/']);
    return false;
  }
  return true;
}
