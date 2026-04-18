import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import {ProductPageUI} from '../models/product-page/product-page.interface';

@Injectable({ providedIn: 'root' })
export class ProductPageService {
  private dataUrl = 'assets/data/product-page.json';
  private data$!: Observable<ProductPageUI>;

  constructor(private http: HttpClient) {
    this.data$ = this.http.get<{ ui: ProductPageUI }>(this.dataUrl).pipe(
      map(data => data.ui),
      shareReplay(1)
    );
  }

  getUI(): Observable<ProductPageUI> {
    return this.data$;
  }
}
