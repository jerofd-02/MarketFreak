export interface HeaderImage {
  src: string;
  alt: string;
}

export interface HeaderButton {
  label: string;
}

export interface Header {
  image: HeaderImage;
  nav_bar: string;
  login_button: HeaderButton;
  register_button: HeaderButton;
}

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface Footer {
  social: SocialLink[];
  columns: FooterColumn[];
}

export interface LayoutData {
  header: Header;
  footer: Footer;
}
