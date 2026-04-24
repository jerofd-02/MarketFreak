import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProfileResponse} from '../models/profile/profile.interface';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private dataUrl = 'assets/data/profile.json';

  constructor(private http: HttpClient) {}

  fetchProfile(): Promise<ProfileResponse> {
    return firstValueFrom(this.http.get<ProfileResponse>(`${this.dataUrl}`));
  }
}
