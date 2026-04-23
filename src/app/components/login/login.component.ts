import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LoginConfig, LoginData} from '../../models/login/login.interface';
import {FormsModule} from '@angular/forms';
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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['../form-style-page/form-style-page.component.css']
})
export class LoginComponent implements OnInit {
  loginData: LoginData = {
    email: '',
    password: ''
  };

  config?: LoginConfig;
  errorMessage?: string;
  loading = false;

  constructor(private loginService: LoginService, private authService: AuthService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loginService.getData().subscribe({
      next: (data) => {
        this.config = data;
        this.cdr.detectChanges();
      }
    });
  }

  async onSubmit() {
    this.errorMessage = undefined;
    this.loading = true;

    try {
      await this.authService.login(this.loginData.email, this.loginData.password);
    } catch (error) {
      this.errorMessage = error as string;
    } finally {
      this.loading = false;
    }
  }
}
