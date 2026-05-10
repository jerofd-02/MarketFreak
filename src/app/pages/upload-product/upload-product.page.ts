import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {firstValueFrom, Subject, takeUntil} from 'rxjs';
import {UploadProductService} from '../../services/upload-product.service';
import {FormStyleData} from '../../models/form-style-page/form-style-page.interface';
import {FormStylePageComponent} from '../../components/form-style-page/form-style-page.component';
import {FirestoreService} from '../../services/firestore.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../models/product/product.interface';
import {ProductService} from '../../services/product.service';
import {AuthService} from '../../services/auth.service';
import {PageLayoutComponent} from '../../components/page-layout/page-layout.component';

@Component({
  selector: 'app-upload-product',
  standalone: true,
  imports: [CommonModule, FormStylePageComponent, PageLayoutComponent],
  templateUrl: './upload-product.page.html',
  styleUrl: './upload-product.page.scss',
})
export class UploadProductPage implements OnInit, OnDestroy {
  formData: FormStyleData | null = null;
  isSubmitting = false;
  existingProduct: Product | null = null;
  isEditMode = false;
  private destroy$ = new Subject<void>();

  constructor(
    private uploadProductService: UploadProductService,
    private firestoreService: FirestoreService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.uploadProductService.getForm().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.ngZone.run(() => {
        this.formData = data;
        this.cdr.detectChanges();
      });
    });

    const editId = this.route.snapshot.queryParamMap.get('edit');
    if (editId) {
      this.isEditMode = true;
      firstValueFrom(this.productService.getProductById(editId)).then(product => {
        this.existingProduct = product ?? null;
        console.log('existingProduct', this.existingProduct);
        this.cdr.detectChanges();
      });
    }
  }

  async onFormSubmit(event: { formValue: any, images: File[], existingImageUrls: string[] }): Promise<void> {
    this.isSubmitting = true;
    const timestamp = Date.now().toString();

    const newImageFiles = event.images;
    const existingUrls = event.existingImageUrls ?? [];
    let imageUrls: string[];

    if (newImageFiles.length > 0) {
      const newUrls= await this.firestoreService.uploadImages(newImageFiles, `productos/${timestamp}`)
      imageUrls = [...existingUrls, ...newUrls];
    } else {
      imageUrls = existingUrls;
    }

    const categoryOptions = this.formData?.fields['category']?.options ?? [];
    const categoryLabel = categoryOptions.find(
      opt => opt.value === event.formValue.category
    )?.label ?? event.formValue.category;

    const firebaseUser = await firstValueFrom(this.authService.currentUser$);
    const loggedUser = firebaseUser ? await this.authService.getLoggedUser(firebaseUser.uid) : null;
    const seller = this.existingProduct?.seller ?? loggedUser?.['seller'] ?? '';

    const data = {
      name: event.formValue.product_name,
      price: new Intl.NumberFormat('es-ES', {style: 'currency', currency: 'EUR'}).format(event.formValue.price),
      category: categoryLabel,
      description: event.formValue.description,
      seller: seller,
      dateAdded: new Date().toISOString().split('T')[0],
      image: imageUrls[0],
      images: imageUrls,
      alt: event.formValue.product_name,
    };

    if (this.isEditMode && this.existingProduct) {
      this.firestoreService.updateDocument('products', this.existingProduct.id, data).subscribe({
        next: () => this.router.navigate(['/product-page', this.existingProduct!.id]),
        error: (err) => {
          console.error("Error al actualizar producto:", err);
          this.isSubmitting = false;
        }
      })
    } else {
      this.firestoreService.saveDocument('products', data).subscribe({
        next: (docRef) => this.router.navigate(['/product-page', docRef.id]),
        error: (err) => {
          console.error('Error al guardar producto:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
