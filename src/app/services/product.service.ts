import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private dataUrl = 'assets/data/products.json';
  private products$!: Observable<Product[]>;

  constructor(private http: HttpClient) {
    this.products$ = this.http.get<{ products: Product[] }>(this.dataUrl).pipe(
      map(data => data.products),
    );
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getRelatedProducts(currentId: number, seller: string, limit = 4): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products
        .filter(p => p.id !== currentId && p.seller === seller)
        .slice(0, limit)
      )
    );
  }
}
