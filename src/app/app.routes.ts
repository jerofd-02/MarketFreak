import {Routes} from '@angular/router';
import {authGuard} from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'confirmation',
    loadComponent: () => import('./pages/confirmation/confirmation.page').then((m) => m.ConfirmationPage),
    canActivate: [authGuard]
  },
  {
    path: 'faq',
    loadComponent: () => import('./components/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },

  {
    path: 'update-profile',
    loadComponent: () => import('./pages/update-profile/update-profile.page').then((m) => m.UpdateProfilePage),
    canActivate: [authGuard]
  },

  {
    path: 'product-page/:id',
    loadComponent: () =>
      import('./pages/product-page/product-page.page').then(m => m.ProductPage)
  },

  {
    path: 'payment/:id',
    loadComponent: () =>
      import('./pages/payment/payment.page').then(m => m.PaymentPage)
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
