import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormStyleData } from '../../models/form-style-page/form-style-page.interface';
import { DynamicFormService } from '../../services/form-style-page.service';

@Component({
  selector: 'app-form-style-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-style-page.component.html',
  styleUrl: './form-style-page.component.css',
})
export class FormStylePageComponent implements OnChanges {
  @Input() formData: FormStyleData | null = null;

  form!: FormGroup;
  imagePreviews: { src: string; file: File }[] = [];

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] && this.formData) {
      this.form = this.dynamicFormService.buildForm(this.formData.fields);
    }
  }

  getFieldKeys(): string[] {
    if (!this.formData) return [];
    return Object.keys(this.formData.fields);
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

    Array.from(files).forEach(file => {
      const yaExiste = this.imagePreviews.some(p =>
        p.file.name === file.name && p.file.size === file.size
      );
      if (yaExiste) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.push({
          src: e.target?.result as string,
          file
        });
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removePreview(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  getErrorMessage(key: string): string {
    const control = this.form.get(key);
    const label = this.formData?.fields[key]?.label ?? key;

    if (control?.hasError('required'))   return `${label} es un campo obligatorio`;
    if (control?.hasError('pattern'))    return `Formato de ${label.toLowerCase()} incorrecto`;
    if (control?.hasError('minlength'))  return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    if (control?.hasError('maxlength'))  return `Máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    if (control?.hasError('min'))        return `El valor mínimo es ${control.errors?.['min'].min}`;

    return 'Campo inválido';
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log({ ...this.form.value, images: this.imagePreviews.map(p => p.file) });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
