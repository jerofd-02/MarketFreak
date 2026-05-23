export interface RegisterData {
  name: string;
  seller: string;
  email: string;
  password: string;
  password_confirm: string;
  location: string;
  province: string;
  description: string;
  photo: string;
}

export interface RegisterConfig {
  title: string;
  fields: {
    name: { label: string, placeholder: string };
    username: { label: string, placeholder: string };
    email: { label: string, placeholder: string };
    password: { label: string, placeholder: string };
    password_confirm: { label: string, placeholder: string };
    avatar: { icon: string; label: string, placeholder: string };
    location: { label: string, placeholder: string };
    province: { label: string, placeholder: string, options: { value: string, label: string }[]; };
    description: { label: string, placeholder: string };
  };
  submitLabel: string;
  loginLink: {
    text: string;
    linkText: string;
  };
}
