import {Injectable} from '@angular/core';
import {addDoc, collection, doc, Firestore, updateDoc} from '@angular/fire/firestore';
import {getDownloadURL, ref, Storage, uploadBytes} from '@angular/fire/storage';
import {from, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class FirestoreService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {
  }

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

  saveDocument(collectionName: string, data: any): Observable<any> {
    const ref = collection(this.firestore, collectionName);
    return from(addDoc(ref, data));
  }

  updateDocument(collectionName: string, id: string, data: any): Observable<void> {
    const ref = doc(this.firestore, `${collectionName}/${id}`);
    return from(updateDoc(ref, data));
  }
}
