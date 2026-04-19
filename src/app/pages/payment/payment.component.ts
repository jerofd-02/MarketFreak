import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { PaymentService } from '../../services/payment.service';
import { Product } from '../../models/product/product.interface';
import { PaymentUI } from '../../models/payment/payment.interface';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit, OnDestroy {
  product: Product | undefined;
  ui: PaymentUI | null = null;
  selectedPayment: string = '';
  selectedShipment: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(productId).pipe(
      takeUntil(this.destroy$)
    ).subscribe(product => {
      this.ngZone.run(() => {
        this.product = product;
        this.cdr.detectChanges();
      });
    });

    this.paymentService.getUI().pipe(
      takeUntil(this.destroy$)
    ).subscribe(ui => {
      console.log('UI:', ui);
      this.ngZone.run(() => {
        this.ui = ui;
        this.selectedPayment = ui.paymentMethods.options[0]?.value ?? '';
        this.selectedShipment = ui.shipmentMethods.options[0]?.value ?? '';
        this.cdr.detectChanges();
      });
    });
  }

  onConfirm(): void {
    this.router.navigate(['/confirmation'], {
      queryParams: {
        productId: this.product?.id,
        payment: this.selectedPayment,
        shipment: this.selectedShipment
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
