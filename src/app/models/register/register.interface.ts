export interface RegisterData {
  name: string;
  seller: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface RegisterConfig {
  title: string;
  fields: {
    name: string;
    label: string;
    placeholder: string;
  }[];
  submitLabel: string;
  forgotLink: {
    text: string;
    linkText: string;
  };
  registerLink: {
    text: string;
    linkText: string;
  };
}
