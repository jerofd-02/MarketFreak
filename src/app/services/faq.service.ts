import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FaqInterface } from '../models/faq/faq.interface';

@Injectable({ providedIn: 'root' })
export class FaqService {

  constructor(private firestore: Firestore) {}

  getData(): Observable<FaqInterface[]> {
    const ref = collection(this.firestore, 'faq');
    return collectionData(ref) as Observable<FaqInterface[]>;
  }
}
