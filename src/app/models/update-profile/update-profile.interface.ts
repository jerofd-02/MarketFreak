import {FormStyleData} from '../form-style-page/form-style-page.interface';

export interface SelectOption {
  value: string;
  label: string;
}

export interface UpdateProfileForm {
  avatar: File | null;
  username: string;
  location: string;
  province: string;
  description: string;
}

export const UPDATE_PROFILE_DEFAULTS: UpdateProfileForm = {
  avatar: null,
  username: '',
  location: 'España',
  province: '',
  description: '',
};

export interface UpdateProfileConfig {
  updateProfile: FormStyleData;
}
