import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

export interface LoggedUser {
  name: string;
  photo?: string;
  seller: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private router: Router) {
  }

  getLoogedUser(): LoggedUser | null {
    return JSON.parse(sessionStorage.getItem('loggedUser') || 'null');
  }

  logout(): void {
    sessionStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
  }

  requireAuth(): void {
    if (!this.getLoogedUser()) {
      this.router.navigate(['/login']);
    }
  }
}
