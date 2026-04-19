import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PaymentData, PaymentUI } from '../models/payment/payment.interface';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private dataUrl = 'assets/data/payment-page.json';

  constructor(private http: HttpClient) {}

  private getData(): Observable<PaymentUI> {
    return this.http.get<PaymentData>(this.dataUrl).pipe(
      map(data => data.payment)
    );
  }

  getUI(): Observable<PaymentUI> {
    return this.getData();
  }
}
