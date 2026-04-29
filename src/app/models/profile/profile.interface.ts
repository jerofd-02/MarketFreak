export interface EditButton {
  label: string;
  routerLink: string;
}

export interface AddProductButton {
  label: string;
  routerLink: string;
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
