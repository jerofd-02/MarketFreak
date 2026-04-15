export interface LoginData {
  email: string;
  password: string;
}

export interface LoginConfig {
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
