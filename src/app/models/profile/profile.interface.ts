export interface EditButton {
  label: string;
  href: string;
}

export interface AddProductButton {
  label: string;
  href: string;
  icon: string;
}

export interface Profile {
  productsTitle: string;
  editButton: EditButton;
  addProductButton: AddProductButton;
}

export interface ProfileResponse {
  profile: Profile;
}
