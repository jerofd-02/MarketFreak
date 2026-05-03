import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {Auth, authState} from '@angular/fire/auth';
import {filter, map, take} from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    filter(user => user !== undefined),
    take(1),
    map(user => {
      if (user) return true;
      router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    })
  )
};
