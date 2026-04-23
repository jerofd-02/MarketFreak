import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {PhotoRow} from '../../components/photo-row/photo-row.component';
import {AuthService} from '../../services/auth.service';
import {Profile} from '../../models/profile/profile.interface';
import {User} from '../../models/user/user.interface';
import {Product} from '../../models/product/product.interface';
import {ProfileService} from '../../services/profile.service';
import {take} from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, PhotoRow],
  templateUrl: './profile.component.html',
  styleUrls: ['../../components/product-info/product-info.component.css', './profile.component.css'],
})
export class ProfilePage implements OnInit {
  profileData: Profile | null = null;
  user: User | null = null;
  products: Product[] = [];
  isOwner = false;

  constructor(private route: ActivatedRoute, private profilePageService: ProfileService, private authService: AuthService, private cdr: ChangeDetectorRef) {
  }

  async ngOnInit(): Promise<void> {
    const seller = this.route.snapshot.queryParamMap.get("seller");

    const [profileJson, productsJson, usersJson] = await Promise.all([
      this.profilePageService.fetchProfile(),
      this.profilePageService.fetchProducts(),
      this.profilePageService.fetchUsers()
    ]);

    this.profileData = profileJson.profile;
    this.products = productsJson?.products?.filter(p => p.seller === seller);
    this.user = usersJson?.users?.find(u => u.seller === seller) ?? null;


    this.authService.currentUser$.pipe(take(1)).subscribe(async firebaseUser => {
      if (firebaseUser) {
        const loggedUser = await this.authService.getLoggedUser(firebaseUser.uid);
        this.isOwner = !!loggedUser && !!seller && loggedUser['seller'] === seller;
      } else {
        this.isOwner = false;
      }
    })
    this.cdr.detectChanges();
  }
}
