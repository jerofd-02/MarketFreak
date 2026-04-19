import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {FormConfig, FormStyleData} from '../models/form-style-page/form-style-page.interface';

@Injectable({ providedIn: 'root' })
export class UploadProductService {
  private dataUrl = 'assets/data/upload-product.json';

  constructor(private http: HttpClient) {}

  getForm(): Observable<FormStyleData> {
    return this.http.get<FormConfig>(this.dataUrl).pipe(
      map(data => data.form)
    );
  }
}
