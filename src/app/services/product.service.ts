import {Injectable} from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  limit,
  query,
  where
} from '@angular/fire/firestore';
import {map, Observable} from 'rxjs';
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
}
