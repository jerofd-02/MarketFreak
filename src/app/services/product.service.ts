import {Injectable} from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData, documentId,
  Firestore,
  getDocs,
  limit,
  query,
  where
} from '@angular/fire/firestore';
import {forkJoin, from, map, Observable} from 'rxjs';
import {Product} from '../models/product/product.interface';

@Injectable({providedIn: 'root'})
export class ProductService {

  constructor(private firestore: Firestore) {
  }

  getProducts(): Observable<Product[]> {
    const ref = collection(this.firestore, 'products');
    return collectionData(ref, {idField: 'id'}) as Observable<Product[]>;
  }

  getProductById(id: string): Observable<Product | undefined> {
    const ref = doc(this.firestore, 'products', id);
    return docData(ref, {idField: 'id'}) as Observable<Product | undefined>;
  }

  getRelatedProducts(currentId: string, seller: string, limitCount = 4): Observable<Product[]> {
    const ref = collection(this.firestore, 'products');
    const q = query(
      ref,
      where('seller', '==', seller),
      limit(limitCount + 1)
    );

    return collectionData(q, {idField: 'id'}).pipe(
      map(products => (products as Product[]).filter(p => p.id !== currentId).slice(0, limitCount))
    );
  }

  async deleteProduct(product: Product) {
    const ref = doc(this.firestore, `products/${product.id}`);
    return deleteDoc(ref);
  }

  getProductsByIds(ids: string[]): Observable<Product[]> {
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 30) {
      chunks.push(ids.slice(i, i + 30));
    }

    const fetches = chunks.map(chunk => {
      const ref = collection(this.firestore, 'products');
      const q = query(ref, where(documentId(), 'in', chunk));
      return from(getDocs(q)).pipe(
        map(snap => snap.docs.map(d => ({id: d.id, ...d.data()} as Product)))
      );
    });

    return forkJoin(fetches).pipe(map(results => results.flat()));
  }
}
