import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  async uploadImages(files: File[], folder: string): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      const storageRef = ref(this.storage, `${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }

    return urls;
  }

  saveDocument(coleccion: string, data: any): Observable<any> {
    const col = collection(this.firestore, coleccion);
    return from(addDoc(col, data));
  }
}
