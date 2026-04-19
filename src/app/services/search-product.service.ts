import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchProductData } from '../models/search-product/search-product.interface';

@Injectable({ providedIn: 'root' })
export class SearchProductService {
  private dataUrl = 'assets/data/search-product.json';

  constructor(private http: HttpClient) {}

  getFilters(): Observable<SearchProductData> {
    return this.http.get<SearchProductData>(this.dataUrl);
  }
}
