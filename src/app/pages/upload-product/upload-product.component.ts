import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { UploadProductService } from '../../services/upload-product.service';
import { FormStyleData } from '../../models/form-style-page/form-style-page.interface';
import { FormStylePageComponent } from '../../components/form-style-page/form-style-page.component';
import {FirestoreService} from '../../services/firestore.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-upload-product',
  standalone: true,
  imports: [CommonModule, FormStylePageComponent],
  templateUrl: './upload-product.component.html',
  styleUrl: './upload-product.component.css',
})
export class UploadProductComponent implements OnInit, OnDestroy {
  formData: FormStyleData | null = null;
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private uploadProductService: UploadProductService,
    private firestoreService: FirestoreService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.uploadProductService.getForm().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.ngZone.run(() => {
        this.formData = data;
        this.cdr.detectChanges();
      });
    });
  }

  async onFormSubmit(event: { formValue: any, images: File[] }): Promise<void> {
    this.isSubmitting = true;
    const timestamp = Date.now().toString();

    const imageUrls = await this.firestoreService.uploadImages(
      event.images,
      `productos/${timestamp}`
    );

    const categoryOptions = this.formData?.fields['category']?.options ?? [];
    const categoryLabel = categoryOptions.find(
      opt => opt.value === event.formValue.category
    )?.label ?? event.formValue.category;

    const data = {
      name: event.formValue.product_name,
      price: event.formValue.price,
      category: categoryLabel,
      description: event.formValue.description,
      seller: 'armin.keenan', // TODO: SUSTITUIR POR EL USUARIO AUTENTICADO
      dateAdded: new Date().toISOString().split('T')[0],
      image: imageUrls[0],
      images: imageUrls,
      alt: event.formValue.product_name,
    };

    this.firestoreService.saveDocument('products', data).subscribe({
      next: (docRef) => this.router.navigate(['/product-page', docRef.id]),
      error: (err) => {
        console.error('Error al guardar producto:', err);
        this.isSubmitting = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
