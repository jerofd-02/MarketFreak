import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {FormStyleData} from '../models/form-style-page/form-style-page.interface';
import {UpdateProfileConfig} from '../models/update-profile/update-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateProfileService {
  private dataUrl = 'assets/data/update-profile.json';

  constructor(private http: HttpClient) {
  }

  getForm(): Observable<FormStyleData> {
    return this.http.get<UpdateProfileConfig>(this.dataUrl).pipe(
      map(data => data.updateProfile)
    );
  }
}
