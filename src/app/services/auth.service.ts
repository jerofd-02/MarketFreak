import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import { Storage, ref, getDownloadURL, listAll } from '@angular/fire/storage';

export interface LoggedUser {
  description: string;
  email: string;
  location: string;
  name: string;
  password: string;
  photo: string;
  seller: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private storage = inject(Storage);

  currentUser$: Observable<FirebaseUser | null>;

  constructor() {
    this.currentUser$ = authState(this.auth)
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      const loggedUser = await this.getLoggedUser(credential.user.uid);
      console.log("Usuario autenticado: ", credential.user.uid);
      this.router.navigate(['/profile'], {queryParams: {seller: loggedUser?.seller}});
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async register(
    name: string,
    seller: string,
    email: string,
    password: string,
    photo: string,
    province: string,
    location: string,
    description: string,
  ): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);

      const finalPhoto = photo ? photo : await this.getRandomAvatar();

      await setDoc(doc(this.firestore, 'users', credential.user.uid), {
        name,
        seller,
        email,
        password,
        photo: finalPhoto,
        location: `${province}, ${location}`,
        description,
      });

      this.router.navigate([""]);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  async getLoggedUser(uid: string): Promise<LoggedUser | null> {
    const docRef = doc(this.firestore, 'users', uid);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() as LoggedUser : null;
  }

  private async getRandomAvatar(): Promise<string> {
    const folderRef = ref(this.storage, 'users/default-images');
    const result = await listAll(folderRef);
    const randomItem = result.items[Math.floor(Math.random() * result.items.length)];
    return await getDownloadURL(randomItem);
  }

  private handleError(error: any) {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'El email ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Email no válido',
    };
    return errorMessages[error.code] || 'Error desconocido';
  }
}
