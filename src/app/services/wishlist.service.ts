import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, switchMap} from 'rxjs';
import {SortOption, WishlistData} from '../models/wishlist/wishlist.interface';
import {ProductService} from './product.service';
import {Product} from '../models/product/product.interface';

@Injectable({providedIn: 'root'})
export class WishlistService {
  private wishlistUrl = 'assets/data/wishlist.json';

  constructor(
    private http: HttpClient,
    private productService: ProductService
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

  getProductsBySeller(seller: string): Observable<Product[]> {
    return this.getData().pipe(
      map(data => data.wishlists.find(w => w.seller === seller)),
      switchMap(wishlist => this.productService.getProducts().pipe(
        map(products => {
          if (!wishlist) return [];
          return wishlist.products
            .map(entry => products.find(p => p.id === entry.id))
            .filter((p): p is Product => p !== undefined);
        })
      ))
    );
  }
}
