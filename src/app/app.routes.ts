import {Routes} from '@angular/router';
import {Home} from './pages/home/home';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ProductPage} from './pages/product-page/product-page.component';
import {FaqComponent} from './components/faq/faq.component';
import {WishlistComponent} from './pages/wishlist/wishlist.component';
import {PaymentComponent} from './pages/payment/payment.component';
import {ContactComponent} from './pages/contact/contact.component';
import {UploadProductComponent} from './pages/upload-product/upload-product.component';
import {SearchProductComponent} from './pages/search-product/search-product.component';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'product-page/:id', component: ProductPage},
  {path: 'faq', component: FaqComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'payment/:id', component: PaymentComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'upload-product', component: UploadProductComponent},
  {path: 'search-product', component: SearchProductComponent},
];
