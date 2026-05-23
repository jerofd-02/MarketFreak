import {Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {of, Subject, switchMap, takeUntil} from 'rxjs';
import {WishlistService} from '../../services/wishlist.service';
import {SortOption} from '../../models/wishlist/wishlist.interface';
import {Product} from '../../models/product/product.interface';
import {PhotoRow} from '../../components/photo-row/photo-row.component';
import {PageLayoutComponent} from '../../components/page-layout/page-layout.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, PhotoRow, PageLayoutComponent],
  templateUrl: './wishlist.page.html',
  styleUrl: './wishlist.page.scss',
})
export class WishlistPage implements OnInit, OnDestroy {
  searchPlaceholder: string = '';
  sortOptions: SortOption[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedSort: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.wishlistService.getSearchPlaceholder().pipe(
      takeUntil(this.destroy$)
    ).subscribe(placeholder => {
      this.ngZone.run(() => {
        this.searchPlaceholder = placeholder;
        this.cdr.detectChanges();
      });
    });

    this.wishlistService.getSortOptions().pipe(
      takeUntil(this.destroy$)
    ).subscribe(options => {
      this.ngZone.run(() => {
        this.sortOptions = options;
        this.selectedSort = options[0]?.value ?? '';
        this.cdr.detectChanges();
      });
    });

    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$),
      switchMap(firebaseUser => {
        if (!firebaseUser) return of([]);
        return this.wishlistService.getWishlistProducts();
      })
    ).subscribe(products => {
      this.ngZone.run(() => {
        this.products = products;
        this.filteredProducts = products;
        this.cdr.detectChanges();
      });
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onSortChange(sort: string): void {
    this.selectedSort = sort;
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = [...this.products];

    if (this.searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    switch (this.selectedSort) {
      case 'price_asc':
        result.sort((a, b) => this.parsePrice(a.price) - this.parsePrice(b.price));
        break;
      case 'price_desc':
        result.sort((a, b) => this.parsePrice(b.price) - this.parsePrice(a.price));
        break;
      case 'date_asc':
        result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      case 'date_desc':
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
    }

    this.filteredProducts = result;
    this.cdr.detectChanges();
  }

  private parsePrice(price: string): number {
    return parseFloat(price.replace(',', '.').replace('€', '').trim());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}