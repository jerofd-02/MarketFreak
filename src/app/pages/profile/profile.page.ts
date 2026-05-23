import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PhotoRow} from '../../components/photo-row/photo-row.component';
import {AuthService} from '../../services/auth.service';
import {Profile} from '../../models/profile/profile.interface';
import {User} from '../../models/user/user.interface';
import {Product} from '../../models/product/product.interface';
import {ProfileService} from '../../services/profile.service';
import {UserService} from '../../services/user.service';
import {ProductService} from '../../services/product.service';
import {firstValueFrom, take} from 'rxjs';
import {PageLayoutComponent} from '../../components/page-layout/page-layout.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PhotoRow, RouterLink, PageLayoutComponent],
  templateUrl: './profile.page.html',
  styleUrls: [
    '../../components/product-info/product-info.component.scss',
    './profile.page.scss',
    '../product/product.page.scss'
  ],
})

export class ProfilePage implements OnInit {
  profileData: Profile | null = null;
  user: User | null = null;
  products: Product[] = [];
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private profilePageService: ProfileService,
    private userService: UserService,
    private productService: ProductService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const seller = this.route.snapshot.queryParamMap.get('seller');
    if (!seller) return;

    const [profileJson, products, user] = await Promise.all([
      this.profilePageService.fetchProfile(),
      firstValueFrom(this.productService.getProducts()),
      firstValueFrom(this.userService.getUserBySeller(seller))
    ]);

    this.profileData = profileJson.profile;
    this.products = products.filter(p => p.seller === seller);
    this.user = user ?? null;

    this.authService.currentUser$.pipe(take(1)).subscribe(async firebaseUser => {
      if (firebaseUser) {
        const loggedUser = await this.authService.getLoggedUser(firebaseUser.uid);
        this.isOwner = !!loggedUser && loggedUser['seller'] === seller;
      } else {
        this.isOwner = false;
      }
      this.cdr.detectChanges();
    });
  }
}
