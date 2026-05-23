import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RegisterConfig} from '../../models/register/register.interface';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {IonButton, IonInput, IonSelect, IonSelectOption, IonTextarea} from '@ionic/angular/standalone';
import {PageLayoutComponent} from '../page-layout/page-layout.component';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (password && confirm && password.value !== confirm.value) {
    confirm.setErrors({passwordMismatch: true});
    return {passwordMismatch: true};
  }
  return null;
}

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    PageLayoutComponent,
    IonButton
  ],
  templateUrl: "./register.component.html",
  styleUrls: ["../form-style-page/form-style-page.component.scss", "register.component.scss"]
})
export class RegisterComponent implements OnInit {
  config?: RegisterConfig;
  errorMessage?: string;
  loading = false;
  form!: FormGroup;
  avatarPreview: string | null = null;

  constructor(
    private registerService: RegisterService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      seller: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirm: ['', Validators.required],
      location: [{value: 'España', disabled: true}],
      province: ['', Validators.required],
      description: ['']
    }, {validator: passwordMatchValidator} as AbstractControlOptions);

    this.registerService.getData().subscribe({
      next: (data) => {
        this.config = data;
        this.cdr.detectChanges()
      }
    })
  }

  get name() {
    return this.form.get('name')!;
  }

  get seller() {
    return this.form.get('seller')!;
  }

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  get password_confirm() {
    return this.form.get('password_confirm')!;
  }

  get province() {
    return this.form.get('province')!;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarPreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = undefined;
    this.loading = true;

    const {name, seller, email, password, province, description} = this.form.getRawValue();

    try {
      await this.authService.register(name, seller, email, password, this.avatarPreview ?? '', province, 'España', description);
    } catch (error) {
      this.errorMessage = error as string;
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
