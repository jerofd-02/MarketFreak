import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RegisterConfig, RegisterData} from '../../models/register/register.interface';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {RegisterService} from '../../services/register.service';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['../form-style-page/form-style-page.component.css']
})
export class RegisterComponent implements OnInit {
  registerData: RegisterData = {
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  };

  config?: RegisterConfig;

  constructor(private registerService: RegisterService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.registerService.getData().subscribe({
      next: (data) => {
        this.config = data;
        this.cdr.detectChanges()
      }
    })
  }

  onSubmit() {
    if (this.registerData.password != this.registerData.password_confirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    console.log(this.registerData);
  }
}
