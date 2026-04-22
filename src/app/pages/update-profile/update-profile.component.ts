import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UpdateProfileService} from '../../services/update-profile.service';
import {UPDATE_PROFILE_DEFAULTS, UpdateProfileForm} from '../../models/update-profile/update-profile.interface';
import {FormField, FormFields} from '../../models/form-style-page/form-style-page.interface';

@Component({
  selector: 'app-update-profile',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './update-profile.component.html',
  styleUrls: ['../../components/form-style-page/form-style-page.component.css', 'update-profile.component.css']
})
export class UpdateProfile implements OnInit {
  form!: FormGroup;
  fields: FormFields = {};
  submitLabel = '';
  avatarPreview: string | null = null;
  avatarFileName: string | null = null;

  constructor(private fb: FormBuilder, private updateProfileService: UpdateProfileService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      avatar: [UPDATE_PROFILE_DEFAULTS.avatar],
      username: [UPDATE_PROFILE_DEFAULTS.username],
      location: [{ value: UPDATE_PROFILE_DEFAULTS.location, disabled: true }],
      province: [UPDATE_PROFILE_DEFAULTS.province],
      description: [UPDATE_PROFILE_DEFAULTS.description],
    });

    this.updateProfileService.getForm().subscribe(data => {
      this.fields = data.fields;
      this.submitLabel = data.submitButton;
    });

    this.cdr.detectChanges();
  }

  getField(name: string): FormField | undefined {
    return this.fields[name];
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.avatarFileName = file.name;
    this.form.patchValue({ avatar: file });

    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    const formValue: UpdateProfileForm = this.form.getRawValue();
    console.log("Formulario enviado: ", formValue);
  }
}
