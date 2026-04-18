import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private dataUrl = 'assets/data/users.json';
  private users$!: Observable<User[]>;

  constructor(private http: HttpClient) {
    this.users$ = this.http.get<{ users: User[] }>(this.dataUrl).pipe(
      map(data => data.users),
    );
  }

  getUserBySeller(seller: string): Observable<User | undefined> {
    return this.users$.pipe(
      map(users => users.find(u => u.seller === seller))
    );
  }
}
