import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {FaqInterface} from '../models/faq/faq.interface';

@Injectable({providedIn: 'root'})
export class FaqService {
  private faqUrl = 'assets/data/faq.json';

  constructor(private http: HttpClient) {
  }

  getData(): Observable<FaqInterface> {
    return this.http.get<{faq: FaqInterface}>(this.faqUrl).pipe(
      map(data => data.faq)
    )
  }
}
