import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LoginConfig, LoginData} from '../../models/login/login.interface';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {LoginService} from '../../services/login.service';

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

  constructor(private loginService: LoginService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loginService.getData().subscribe({
      next: (data) => {
        this.config = data;
        this.cdr.detectChanges();
      }
    })
  }

  onSubmit() {
    console.log(this.loginData);
  }
}
