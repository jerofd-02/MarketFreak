import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UpdateProfileService} from '../../services/update-profile.service';
import {UPDATE_PROFILE_DEFAULTS, UpdateProfileForm} from '../../models/update-profile/update-profile.interface';
import {FormFields} from '../../models/form-style-page/form-style-page.interface';
import {Router} from '@angular/router';

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
  currentSeller: string = '';

  constructor(
    private fb: FormBuilder,
    private updateProfileService: UpdateProfileService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      avatar: [UPDATE_PROFILE_DEFAULTS.avatar],
      username: [UPDATE_PROFILE_DEFAULTS.username, [
        Validators.required,
      ]],
      location: [{value: UPDATE_PROFILE_DEFAULTS.location, disabled: true}],
      province: [UPDATE_PROFILE_DEFAULTS.province, Validators.required],
      description: [UPDATE_PROFILE_DEFAULTS.description]
    } as AbstractControlOptions);

    this.updateProfileService.getForm().subscribe(data => {
      this.fields = data.fields;
      this.submitLabel = data.submitButton;
    });

    this.loadUserData();
  }

  get username() {
    return this.form.get('username')!;
  }

  get province() {
    return this.form.get('province')!;
  }

  async loadUserData(): Promise<void> {
    try {
      const data = await this.updateProfileService.getCurrentUserData();
      if (data) {
        this.currentSeller = data.seller;
        const province = data.location?.split(',')[0]?.trim() ?? '';
        this.form.patchValue({
          username: data.name,
          province,
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

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.avatarFileName = file.name;
    this.form.patchValue({avatar: file});

    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarPreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      const formValue: UpdateProfileForm = this.form.getRawValue();
      let photoUrl: string = typeof formValue.avatar === 'string' ? formValue.avatar : this.avatarPreview ?? '';

      if (formValue.avatar instanceof File) {
        photoUrl = await this.updateProfileService.uploadPhoto(formValue.avatar);
      }

      await this.updateProfileService.updateUserData({
        name: formValue.username,
        location: `${formValue.province}, España`,
        description: formValue.description,
        photo: photoUrl,
      });

      await this.router.navigate(['/profile'], {queryParams: {seller: this.currentSeller}});
      this.successMessage = "Perfil actualizado correctamente.";
    } catch (error) {
      this.errorMessage = "Error al actualizar el perfil.";
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
