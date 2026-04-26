import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RegisterConfig, RegisterData} from '../../models/register/register.interface';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['../form-style-page/form-style-page.component.css']
})
export class RegisterComponent implements OnInit {
  registerData: RegisterData = {
    name: '',
    seller: '',
    email: '',
    password: '',
    password_confirm: '',
    location: 'España',
    province: '',
    description: '',
    photo: ''
  };

  config?: RegisterConfig;
  errorMessage?: string;
  loading = false;

  constructor(private registerService: RegisterService, private authService: AuthService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.registerService.getData().subscribe({
      next: (data) => {
        this.config = data;
        this.cdr.detectChanges()
      }
    })
  }

  async onSubmit() {
    if (this.registerData.password != this.registerData.password_confirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    this.errorMessage = undefined;
    this.loading = true;

    try {
      await this.authService.register(
        this.registerData.name,
        this.registerData.seller,
        this.registerData.email,
        this.registerData.password,
        this.registerData.photo,
        this.registerData.province,
        this.registerData.location,
        this.registerData.description
      );
    } catch (error) {
      this.errorMessage = error as string;
    } finally {
      this.loading = false;
    }
  }
}
