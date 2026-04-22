import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ProductPage} from './pages/product-page/product-page.component';
import {FaqComponent} from './components/faq/faq.component';
import {WishlistComponent} from './pages/wishlist/wishlist.component';
import {PaymentComponent} from './pages/payment/payment.component';
import {ContactComponent} from './pages/contact/contact.component';
import {UploadProductComponent} from './pages/upload-product/upload-product.component';
import {SearchProductComponent} from './pages/search-product/search-product.component';
import {ProfilePage} from './pages/profile/profile.component';
import {UpdateProfile} from './pages/update-profile/update-profile.component';
import {Confirmation} from './pages/confirmation/confirmation.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'product-page/:id', component: ProductPage},
  {path: 'faq', component: FaqComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'payment/:id', component: PaymentComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'upload-product', component: UploadProductComponent},
  {path: 'search-product', component: SearchProductComponent},
  {path: 'profile', component: ProfilePage},
  {path: 'update-profile', component: UpdateProfile},
  {path: 'confirmation', component: Confirmation}
];
