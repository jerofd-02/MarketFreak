import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {firstValueFrom, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {ProductService} from '../../services/product.service';
import {UserService} from '../../services/user.service';
import {ProductPageService} from '../../services/product-page.service';
import {User} from '../../models/user/user.interface';
import {PhotoRow} from '../../components/photo-row/photo-row.component';
import {ProductInfo} from '../../components/product-info/product-info.component';
import {CarouselItem, Product} from '../../models/product/product.interface';
import {CarouselComponent} from '../../components/carousel/carousel.component';
import {ProductPageUI} from '../../models/product-page/product-page.interface';
import {AuthService} from '../../services/auth.service';
import {WishlistService} from '../../services/wishlist.service';
import {Auth} from '@angular/fire/auth';
import {IonButton} from '@ionic/angular/standalone';
import {PageLayoutComponent} from '../../components/page-layout/page-layout.component';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PhotoRow, ProductInfo, CarouselComponent, IonButton, PageLayoutComponent],
  templateUrl: './product-page.page.html',
  styleUrl: './product-page.page.scss',
})
export class ProductPage implements OnInit, OnDestroy {
  product: Product | undefined;
  user: User | undefined;
  relatedProducts: Product[] = [];
  carousel: CarouselItem | null = null;
  ui: ProductPageUI | null = null;
  isOwner = false;
  isInWishlist = false;
  isWishlistLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private userService: UserService,
    private authService: AuthService,
    private productPageService: ProductPageService,
    private cdr: ChangeDetectorRef,
    private wishlistService: WishlistService,
    private auth: Auth,
  ) {}

  ngOnInit(): void {
    this.productPageService.getUI().pipe(
      takeUntil(this.destroy$)
    ).subscribe(ui => this.ui = ui);

    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const id = params.get('id') ?? '';
        return this.productService.getProductById(id);
      }),
      tap(product => {
        this.product = product;
        if (product) {
          this.carousel = {
            id: String(product.id),
            name: product.name,
            alt: product.alt,
            images: product.images,
          };

          this.productService.getRelatedProducts(product.id, product.seller).pipe(
            takeUntil(this.destroy$)
          ).subscribe(products => this.relatedProducts = products);

          this.wishlistService.isInWishlist(String(product.id)).pipe(
            takeUntil(this.destroy$)
          ).subscribe(inWishlist => {
            this.isInWishlist = inWishlist;
            this.cdr.detectChanges();
          });

          firstValueFrom(this.authService.currentUser$).then(async firebaseUser => {
            if (firebaseUser) {
              const loggedUser = await this.authService.getLoggedUser(firebaseUser.uid);
              this.isOwner = !!loggedUser && loggedUser['seller'] === product.seller;
            } else {
              this.isOwner = false;
            }
            this.cdr.detectChanges();
          });
        }
      }),
      switchMap(product => this.userService.getUserBySeller(product?.seller ?? ''))
    ).subscribe(user => {
      this.user = user;
      this.cdr.detectChanges();
    });
  }

  async deleteProduct(): Promise<void> {
    if (!this.product) return;
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      const seller = this.product.seller;
      this.destroy$.next();
      await this.productService.deleteProduct(this.product);
      this.router.navigate(['/profile'], { queryParams: { seller } });
    }
  }

  async toggleWishlist(): Promise<void> {
    if (!this.product || this.isWishlistLoading) return;
    if (!this.auth.currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.isWishlistLoading = true;
    try {
      if (this.isInWishlist) {
        await this.wishlistService.removeFromWishlist(String(this.product.id));
      } else {
        await this.wishlistService.addToWishlist(String(this.product.id));
      }
      this.isInWishlist = !this.isInWishlist;
    } finally {
      this.isWishlistLoading = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}