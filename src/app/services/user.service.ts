import {Injectable} from '@angular/core';
import {Observable, map, from} from 'rxjs';
import {User} from '../models/user/user.interface';
import {collection, Firestore, getDocs, query, where} from '@angular/fire/firestore';

@Injectable({providedIn: 'root'})
export class UserService {
  private dataUrl = 'assets/data/users.json';
  private users$!: Observable<User[]>;

  constructor(private firestore: Firestore) {
  }

  getUserBySeller(seller: string): Observable<User | undefined> {
    const ref = collection(this.firestore, 'users');
    const q = query(ref, where('seller', '==', seller));

    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.empty) return undefined;
        const doc = snapshot.docs[0];
        return {id: doc.id, ...doc.data()} as unknown as User;
      })
    );
  }
}
