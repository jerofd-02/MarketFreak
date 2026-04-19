import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { UploadProductService } from '../../services/upload-product.service';
import { FormStyleData } from '../../models/form-style-page/form-style-page.interface';
import { FormStylePageComponent } from '../../components/form-style-page/form-style-page.component';

@Component({
  selector: 'app-upload-product',
  standalone: true,
  imports: [CommonModule, FormStylePageComponent],
  templateUrl: './upload-product.component.html',
  styleUrl: './upload-product.component.css',
})
export class UploadProductComponent implements OnInit, OnDestroy {
  formData: FormStyleData | null = null;
  private destroy$ = new Subject<void>();

  // TODO: Asociar el boton de subir producto con la pagina (una vez creado profile)

  constructor(
    private uploadProductService: UploadProductService,
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
