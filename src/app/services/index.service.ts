import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {CarouselItem, IndexData, Product, ProductsData} from '../models/product/product.interface';

@Injectable({providedIn: 'root'})
export class IndexService {
  private productsUrl = 'assets/data/products.json';
  private indexUrl = 'assets/data/index.json';

  constructor(private http: HttpClient) {
  }

  getCarousel(): Observable<CarouselItem> {
    return this.http.get<IndexData>(this.indexUrl).pipe(
      map(data => data['image-loader'][0])
    );
  }

  getMainTitle(): Observable<string> {
    return this.http.get<IndexData>(this.indexUrl).pipe(
      map(data => data.main_title)
    );
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
