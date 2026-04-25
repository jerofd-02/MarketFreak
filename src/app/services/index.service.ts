import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { CarouselItem, IndexData, Product } from '../models/product/product.interface';

@Injectable({ providedIn: 'root' })
export class IndexService {
  private indexUrl = 'assets/data/index.json';

  constructor(
    private http: HttpClient,
    private firestore: Firestore
  ) {}

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
    const ref = collection(this.firestore, 'products');
    return collectionData(ref, { idField: 'id' }) as Observable<Product[]>;
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
