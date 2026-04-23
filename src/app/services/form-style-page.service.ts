import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class DynamicFormService {

  constructor(private fb: FormBuilder) {}

  buildForm(fields: Record<string, any>): FormGroup {
    const group: Record<string, any> = {};

    for (const key of Object.keys(fields)) {
      const field = fields[key];
      if (field.type === 'file') continue;
      const validators = this.buildValidators(field.validation ?? {});
      group[key] = ['', validators];
    }

    return this.fb.group(group);
  }

  private buildValidators(validation: Record<string, any>): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (validation['required']) validators.push(Validators.required);
    if (validation['pattern']) validators.push(Validators.pattern(validation['pattern']));
    if (validation['minLength'] != null) validators.push(Validators.minLength(validation['minLength']));
    if (validation['maxLength'] != null) validators.push(Validators.maxLength(validation['maxLength']));
    if (validation['min'] != null) validators.push(Validators.min(validation['min']));
    if (validation['max'] != null) validators.push(Validators.max(validation['max']));

    return validators;
  }
}
