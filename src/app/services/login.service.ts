import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {LoginConfig} from '../models/login/login.interface';

@Injectable({providedIn: 'root'})
export class LoginService {
  private loginUrl = 'assets/data/login.json';

  constructor(private http: HttpClient) {
  }

  getData(): Observable<LoginConfig> {
    return this.http.get<{login: LoginConfig}>(this.loginUrl).pipe(
      map(data => data.login)
    )
  }
}
