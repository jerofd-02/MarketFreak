import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {PaymentService} from '../../services/payment.service';
import {PaymentUI} from '../../models/payment/payment.interface';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule, FormsModule],
  templateUrl: './confirmation.component.html',
  styleUrl: '../payment/payment.component.css',
})
export class Confirmation implements OnInit {
  orderData: OrderData | null = null;
  seller: User | null = null;
  public paymentUI : PaymentUI | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const raw = sessionStorage.getItem('orderData');
    if (!raw) {
      this.router.navigate(['/']);
      return;
    }

    this.orderData = JSON.parse(raw) as OrderData;
    this.loadSeller(this.orderData.seller);

    this.paymentService.getUI().subscribe((payment: PaymentUI) => {
      this.paymentUI = payment;
    })

    this.cdr.detectChanges();
  }

  private loadSeller(sellerUsername: string): void {
    this.http.get<{ users: User[] }>('assets/data/users.json').subscribe({
      next: (data) => {
        this.seller = data.users.find(u => u.seller === sellerUsername) ?? null;
      },
      error: (err) => console.error("Error fetching users: ", err)
    });
  }

  getPaymentLabel(): string {
    return this.paymentUI?.paymentMethods.options
      .find(o => o.value === this.orderData?.payment)?.label ?? this.orderData?.payment ?? '';
  }

  getShipmentLabel(): string {
    return this.paymentUI?.shipmentMethods.options
      .find(o => o.value === this.orderData?.shipment)?.label ?? this.orderData?.shipment ?? '';
  }

  onSubmit(): void {
    sessionStorage.removeItem('orderData');
    this.router.navigate(['/']);
  }
}
