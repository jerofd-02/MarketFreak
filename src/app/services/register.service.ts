import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {RegisterConfig} from '../models/register/register.interface';

@Injectable({providedIn: 'root'})
export class RegisterService {
  private registerUrl = 'assets/data/register.json';

  constructor(private http: HttpClient) {
  }

  getData(): Observable<RegisterConfig> {
    return this.http.get<{register: RegisterConfig}>(this.registerUrl).pipe(
      map(data => data.register)
    )
  }
}
