export interface RegisterData {
  name: String;
  username: String;
  email: String;
  password: String;
  password_confirm: String;
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
