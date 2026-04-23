export interface FormOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormField {
  icon?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  step?: string;
  maxImages?: number;
  validation?: {
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  options?: FormOption[];
}

export interface FormFields {
  [key: string]: FormField;
}

export interface FormStyleData {
  fields: FormFields;
  submitButton: string;
}

export interface FormConfig {
  form: FormStyleData;
}
