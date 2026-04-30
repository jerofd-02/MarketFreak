import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FormStyleData} from '../../models/form-style-page/form-style-page.interface';
import {DynamicFormService} from '../../services/form-style-page.service';
import {Product} from '../../models/product/product.interface';

@Component({
  selector: 'app-form-style-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-style-page.component.html',
  styleUrl: './form-style-page.component.css',
})
export class FormStylePageComponent implements OnChanges {
  @Input() formData: FormStyleData | null = null;
  @Input() isSubmitting = false;
  @Input() existingValues!: Product | null;
  @Output() formSubmit = new EventEmitter<{ formValue: any; images: File[], existingImageUrls: string[] }>();

  form!: FormGroup;
  imagePreviews: { src: string; file: File | null }[] = [];
  imageError = false;
  private patched = false;

  constructor(private dynamicFormService: DynamicFormService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] && this.formData) {
      this.form = this.dynamicFormService.buildForm(this.formData.fields);
    }

    if (this.form && this.existingValues && !this.patched) {
      this.patched = true;

      const cleanPrice = parseFloat(
        this.existingValues.price.replace('€', '').replace(',', '.')
      )

      const categoryOptions = this.formData?.fields['category']?.options ?? [];
      const categoryValue = categoryOptions.find(
        opt => opt.label === this.existingValues!.category
      )?.value ?? this.existingValues;

      this.form.patchValue({
        product_name: this.existingValues.name,
        price: cleanPrice,
        category: categoryValue,
        description: this.existingValues.description,
      });

      this.imagePreviews = this.existingValues.images.map(url => ({
        src: url,
        file: null as any
      }));
    }
  }

  getFieldKeys(): string[] {
    return Object.keys(this.formData?.fields ?? {});
  }

  isSelect(key: string): boolean {
    return this.formData?.fields[key]?.type === 'select';
  }

  isTextarea(key: string): boolean {
    return this.formData?.fields[key]?.type === 'textarea';
  }

  isFile(key: string): boolean {
    return this.formData?.fields[key]?.type === 'file';
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    const maxImages = this.formData?.fields['image']?.maxImages ?? Infinity;

    Array.from(files).forEach(file => {
      if (this.imagePreviews.length >= maxImages) return;

      const yaExiste = this.imagePreviews.some(p =>
        p.file && p.file.name === file.name && p.file.size === file.size
      );
      if (yaExiste) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews = [...this.imagePreviews, {
          src: e.target?.result as string,
            file
        }];
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });

    this.imageError = false;
    input.value = '';
  }

  removePreview(index: number, event?: MouseEvent): void {
    event?.stopPropagation();
    this.imagePreviews = this.imagePreviews.filter((_, i) => i !== index);
    this.cdr.detectChanges();
  }

  getErrorMessage(key: string): string {
    const control = this.form.get(key);
    const label = this.formData?.fields[key]?.label ?? key;

    if (control?.hasError('required')) return `${label} es un campo obligatorio`;
    if (control?.hasError('pattern')) return `Formato de ${label.toLowerCase()} incorrecto`;
    if (control?.hasError('minlength')) return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    if (control?.hasError('maxlength')) return `Máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    if (control?.hasError('min')) return `El valor mínimo es ${control.errors?.['min'].min}`;

    return 'Campo inválido';
  }

  onSubmit(): void {
    const imageRequired = this.formData?.fields['image']?.validation?.required ?? false;
    const sinImagenes = imageRequired && this.imagePreviews.length === 0;
    const newImages = this.imagePreviews.filter(p => p.file != null);

    if (this.form.valid && !sinImagenes && !this.isSubmitting) {
      this.formSubmit.emit({
        formValue: this.form.value,
        images: newImages.map(p => p.file).filter((f): f is File => f !== null),
        existingImageUrls: this.imagePreviews.filter(p => p.file == null).map(p => p.src),
      });
    } else {
      this.form.markAllAsTouched();
      if (sinImagenes) {
        this.imageError = true;
      }
    }
  }
}
