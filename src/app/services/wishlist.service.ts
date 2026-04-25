import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, switchMap} from 'rxjs';
import {SortOption, WishlistData} from '../models/wishlist/wishlist.interface';
import {ProductService} from './product.service';
import {Product} from '../models/product/product.interface';
import {Firestore, collection, query, where, collectionData} from '@angular/fire/firestore';

@Injectable({providedIn: 'root'})
export class WishlistService {
  private wishlistUrl = 'assets/data/wishlist.json';

  constructor(private http: HttpClient, private firestore: Firestore, private productService: ProductService) {
  }

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
    const ref = collection(this.firestore, 'wishlists');
    const q = query(ref, where('seller', '==', seller));

    return (collectionData(q) as Observable<any[]>).pipe(
      switchMap(wishlists => {
        const wishlist = wishlists[0];
        if (!wishlist?.products?.length) return [[]];

        const productIds: string[] = wishlist.products.map((p: any) => p.id);

        return this.productService.getProducts().pipe(
          map(products => products.filter(p => productIds.includes(p.id)))
        );
      })
    );
  }
}
