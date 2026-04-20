import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProfileResponse} from '../models/profile/profile.interface';
import {firstValueFrom} from 'rxjs';
import {ProductResponse} from '../models/product/product.interface';
import {UserResponse} from '../models/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private dataUrl = 'assets/data';

  constructor(private http: HttpClient) {
  }

  fetchProfile(): Promise<ProfileResponse> {
    return firstValueFrom(this.http.get<ProfileResponse>(`${this.dataUrl}/profile.json`));
  }

  fetchProducts(): Promise<ProductResponse> {
    return firstValueFrom(this.http.get<ProductResponse>(`${this.dataUrl}/products.json`));
  }

  fetchUsers(): Promise<UserResponse> {
    return firstValueFrom(this.http.get<UserResponse>(`${this.dataUrl}/users.json`));
  }
}
