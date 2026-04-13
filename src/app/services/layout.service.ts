import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Footer, Header, LayoutData} from '../models/layout/layout.interface';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private jsonUrl = 'assets/data/common.json';

  constructor(private http: HttpClient) {
  }

  getHeader(): Observable<Header> {
    return this.http.get<LayoutData>(this.jsonUrl).pipe(
      map(data => data.header)
    );
  }

  getFooter(): Observable<Footer> {
    return this.http.get<LayoutData>(this.jsonUrl).pipe(
      map(data => data.footer)
    );
  }
}
