import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FormStyleData} from '../../models/form-style-page/form-style-page.interface';

@Component({
  selector: 'app-form-style-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-style-page.component.html',
  styleUrl: './form-style-page.component.css',
})
export class FormStylePageComponent {
  @Input() formData: FormStyleData | null = null;
  imagePreviews: { url: string; file: File }[] = [];

  getFieldKeys(): string[] {
    if (!this.formData) return [];
    return Object.keys(this.formData.fields);
  }

  isSelect(key: string): boolean {
    return !!this.formData?.fields[key]?.options;
  }

  isTextarea(key: string): boolean {
    return key === 'description';
  }

  isFile(key: string): boolean {
    return key === 'image';
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.push({
          url: e.target?.result as string,
          file
        });
      };
      reader.readAsDataURL(file);
    });
  }

  removePreview(index: number): void {
    this.imagePreviews.splice(index, 1);
  }
}
