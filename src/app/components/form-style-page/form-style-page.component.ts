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
}
