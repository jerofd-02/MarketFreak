import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {FormStyleData} from '../models/form-style-page/form-style-page.interface';
import {UpdateProfileConfig} from '../models/update-profile/update-profile.interface';
import {LoggedUser} from './auth.service';
import {Auth} from '@angular/fire/auth';
import {doc, Firestore, getDoc, updateDoc} from '@angular/fire/firestore';
import {Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UpdateProfileService {
  private dataUrl = 'assets/data/update-profile.json';

  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage, private http: HttpClient) {
  }

  getForm(): Observable<FormStyleData> {
    return this.http.get<UpdateProfileConfig>(this.dataUrl).pipe(
      map(data => data.updateProfile)
    );
  }

  async getCurrentUserData(): Promise<LoggedUser | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const docRef = doc(this.firestore, 'users', user.uid);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() as LoggedUser : null;
  }

  async uploadPhoto(file: File): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    const storageRef = ref(this.storage, `avatars/${user.uid}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async updateUserData(data: Partial<LoggedUser>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error("No hay usuario autenticado");

    const docRef = doc(this.firestore, 'users', user.uid);
    await updateDoc(docRef, {...data});
  }
}
