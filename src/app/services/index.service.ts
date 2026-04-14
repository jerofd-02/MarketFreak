import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Product, ProductsData} from '../models/product/product.interface';

@Injectable({providedIn: 'root'})
export class IndexService {
  private productsUrl = 'assets/data/products.json';

  constructor(private http: HttpClient) {
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<ProductsData>(this.productsUrl).pipe(
      map(data => data.products)
    );
  }

  getRandomProducts(count: number = 8): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products =>
        [...products]
          .sort(() => Math.random() - 0.5)
          .slice(0, count)
      )
    );
  }
}
