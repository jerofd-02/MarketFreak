import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UpdateProfileService} from '../../services/update-profile.service';
import {UPDATE_PROFILE_DEFAULTS, UpdateProfileForm} from '../../models/update-profile/update-profile.interface';
import {FormField, FormFields} from '../../models/form-style-page/form-style-page.interface';

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['../../components/form-style-page/form-style-page.component.css', 'update-profile.component.css']
})
export class UpdateProfile implements OnInit {
  form!: FormGroup;
  fields: FormFields = {};
  submitLabel = '';
  avatarPreview: string | null = null;
  avatarFileName: string | null = null;
  errorMessage?: string;
  successMessage?: string;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private updateProfileService: UpdateProfileService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      avatar: [UPDATE_PROFILE_DEFAULTS.avatar],
      username: [UPDATE_PROFILE_DEFAULTS.username],
      location: [{value: UPDATE_PROFILE_DEFAULTS.location, disabled: true}],
      province: [UPDATE_PROFILE_DEFAULTS.province],
      description: [UPDATE_PROFILE_DEFAULTS.description],
    });

    this.updateProfileService.getForm().subscribe(data => {
      this.fields = data.fields;
      this.submitLabel = data.submitButton;
    });

    this.loadUserData();
  }

  async loadUserData(): Promise<void> {
    try {
      const data = await this.updateProfileService.getCurrentUserData();
      if (data) {
        this.form.patchValue({
          username: data.name,
          province: data.location,
          description: data.description,
          avatar: data.photo,
        });
        this.avatarPreview = data.photo;
        this.cdr.detectChanges();
      }
    } catch (error) {
      this.errorMessage = "Error al cargar los datos del usuario.";
    }
  }

  getField(name: string): FormField | undefined {
    return this.fields[name];
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.avatarFileName = file.name;
    this.form.patchValue({avatar: file});

    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = undefined;
    this.successMessage = undefined;
    this.loading = true;

    try {
      const formValue: UpdateProfileForm = this.form.getRawValue();
      let photoUrl: string = typeof formValue.avatar === 'string' ? formValue.avatar : this.avatarPreview ?? '';

      if (formValue.avatar instanceof File) {
        photoUrl = await this.updateProfileService.uploadPhoto(formValue.avatar);
      }

      await this.updateProfileService.updateUserData({
        name: formValue.username,
        location: formValue.province,
        description: formValue.description,
        photo: photoUrl,
      });

      this.successMessage = "Perfil actualizado correctamente.";
    } catch (error) {
      this.errorMessage = "Error al actualizar el perfil.";
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
