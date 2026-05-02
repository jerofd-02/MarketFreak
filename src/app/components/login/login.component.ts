import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LoginConfig} from '../../models/login/login.interface';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {LoginService} from '../../services/login.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['../form-style-page/form-style-page.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  config?: LoginConfig;
  errorMessage?: string;
  loading = false;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.loginService.getData().subscribe({
      next: (data) => {
        this.config = data;
        this.cdr.detectChanges();
      }
    });
  }

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = undefined;
    this.loading = true;

    try {
      await this.authService.login(this.email.value, this.password.value);
    } catch (error) {
      this.errorMessage = error as string;
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
