import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, from, map, Observable, of, switchMap } from 'rxjs';
import { SortOption, WishlistData } from '../models/wishlist/wishlist.interface';
import { ProductService } from './product.service';
import { Product } from '../models/product/product.interface';
import { SqliteService } from './sqlite.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private wishlistUrl = 'assets/data/wishlist.json';

  constructor(
    private http: HttpClient,
    private sqliteService: SqliteService,
    private authService: AuthService,
  ) {}

  getData(): Observable<WishlistData> {
    return this.http.get<WishlistData>(this.wishlistUrl);
  }

  getSearchPlaceholder(): Observable<string> {
    return this.getData().pipe(map(data => data.searchPlaceholder));
  }

  getSortOptions(): Observable<SortOption[]> {
    return this.getData().pipe(map(data => data.sortOptions));
  }

  getWishlistProducts(): Observable<Product[]> {
    return this.authService.currentUser$.pipe(
      switchMap(firebaseUser => {
        if (!firebaseUser) return of([]);
        return from(this.sqliteService.getWishlistProducts(firebaseUser.uid));
      })
    );
  }

  async addToWishlist(product: Product): Promise<void> {
    const firebaseUser = await firstValueFrom(this.authService.currentUser$);
    if (!firebaseUser) throw new Error('Usuario no autenticado');
    await this.sqliteService.addToWishlist(String(product.id), firebaseUser.uid, product);
  }

  async removeFromWishlist(productId: string): Promise<void> {
    if (confirm('¿Estás seguro que quieres borrarlo de la lista de deseos?')) {
      const firebaseUser = await firstValueFrom(this.authService.currentUser$);
      if (!firebaseUser) throw new Error('Usuario no autenticado');
      await this.sqliteService.removeFromWishlist(productId, firebaseUser.uid);
    }
  }

  isInWishlist(productId: string): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      switchMap(firebaseUser => {
        if (!firebaseUser) return of(false);
        return from(this.sqliteService.isInWishlist(productId, firebaseUser.uid));
      })
    );
  }
}
