import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, from, map, Observable, of, switchMap} from 'rxjs';
import {SortOption, WishlistData, WishlistEntry} from '../models/wishlist/wishlist.interface';
import {ProductService} from './product.service';
import {Product} from '../models/product/product.interface';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  where,
  collection,
  query,
  collectionData,
  getDocs
} from '@angular/fire/firestore';
import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class WishlistService {
  private wishlistUrl = 'assets/data/wishlist.json';

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
    private productService: ProductService,
    private authService: AuthService,
  ) {
  }

  getData(): Observable<WishlistData> {
    return this.http.get<WishlistData>(this.wishlistUrl);
  }

  getSearchPlaceholder(): Observable<string> {
    return this.getData().pipe(map(data => data.searchPlaceholder));
  }

  getSortOptions(): Observable<SortOption[]> {
    return this.getData().pipe(map(data => data.sortOptions));
  }

  private getWishlistEntries(seller: string): Observable<WishlistEntry[]> {
    const ref = collection(this.firestore, 'wishlists');
    const q = query(ref, where('seller', '==', seller));
    return (collectionData(q) as Observable<any[]>).pipe(
      map(docs => docs[0]?.products ?? [])
    );
  }

  getProductsBySeller(seller: string): Observable<Product[]> {
    return this.getWishlistEntries(seller).pipe(
      switchMap(entries => {
        if (!entries.length) return of([]);
        const ids = entries.map(e => e.id);
        return this.productService.getProducts().pipe(
          map(products =>
            products
              .filter(p => ids.includes(String(p.id)))
              .map(p => ({
                ...p,
                dateAdded: entries.find(e => e.id === p.id)?.dateAdded ?? '',
              }))
          )
        );
      })
    )
  }

  private async getWishlistDocRef(seller: string) {
    const ref = collection(this.firestore, 'wishlists');
    const q = query(ref, where('seller', '==', seller));
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs[0].ref;
    const newRef = doc(ref);
    await setDoc(newRef, {seller, products: []});
    return newRef;
  }

  async addToWishlist(productId: string): Promise<void> {
    const seller = await this.getCurrentSeller();
    if (!seller) throw new Error('Usuario no autenticado');
    const entry: WishlistEntry = {
      id: productId,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    const docRef = await this.getWishlistDocRef(seller);
    await updateDoc(docRef, {products: arrayUnion(entry)});
  }

  async removeFromWishlist(productId: string): Promise<void> {
    if (confirm('¿Estás seguro que quieres borrarlo de la lista de deseos?')) {
      const seller = await this.getCurrentSeller();
      if (!seller) throw new Error('Usuario no autenticado');
      const docRef = await this.getWishlistDocRef(seller);
      const snap = await getDoc(docRef);
      const current: WishlistEntry[] = snap.data()?.['products'] ?? [];
      const updated = current.filter(e => e.id !== productId);
      await updateDoc(docRef, {products: updated});
    }
  }

  isInWishlist(productId: string): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      switchMap(firebaseUser => {
        if (!firebaseUser) return of(false);
        return from(this.authService.getLoggedUser(firebaseUser.uid)).pipe(
          switchMap(loggedUser => {
            const seller = loggedUser?.['seller'];
            if (!seller) return of(false);
            return this.getWishlistEntries(seller).pipe(
              map(entries => entries.some(e => String(e.id) === String(productId))),
            );
          })
        );
      })
    );
  }

  private async getCurrentSeller() {
    const firebaseUser = await firstValueFrom(this.authService.currentUser$);
    if (!firebaseUser) return null;
    const loggedUser = await this.authService.getLoggedUser(firebaseUser.uid);
    return loggedUser?.['seller'] ?? null;
  }
}
