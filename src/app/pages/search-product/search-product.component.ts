import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {Subject, takeUntil, combineLatest} from 'rxjs';
import { SearchProductService } from '../../services/search-product.service';
import { ProductService } from '../../services/product.service';
import { Filter, FilterRange } from '../../models/search-product/search-product.interface';
import { Product } from '../../models/product/product.interface';
import { PhotoRow } from '../../components/photo-row/photo-row.component';
import { RangeSliderComponent } from '../../components/range-slider/range-slider.component';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [CommonModule, FormsModule, PhotoRow, RangeSliderComponent],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.css',
})
export class SearchProductComponent implements OnInit, OnDestroy {
  filters: Filter[] = [];
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  query: string = '';
  sidebarOpen: boolean = false;

  activeFilters: {
    price: string | null;
    priceRange: FilterRange | null;
    dateSort: string | null;
    dateRange: string | null;
    category: string[];
  } = {
    price: null,
    priceRange: null,
    dateSort: null,
    dateRange: null,
    category: []
  };

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private searchProductService: SearchProductService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    combineLatest({
      filters: this.searchProductService.getFilters(),
      products: this.productService.getProducts()
    }).pipe(takeUntil(this.destroy$))
      .subscribe(({ filters, products }) => {
        this.ngZone.run(() => {
          this.filters = filters.filters;

          this.route.queryParamMap.pipe(
            takeUntil(this.destroy$)
          ).subscribe(params => {
            this.query = params.get('q')?.toLowerCase().trim() ?? '';
            this.allProducts = this.query
              ? products.filter(p =>
                p.name.toLowerCase().includes(this.query) ||
                p.category.toLowerCase().includes(this.query) ||
                p.seller.toLowerCase().includes(this.query)
              )
              : products;
            this.filteredProducts = [...this.allProducts];
            this.activeFilters = {
              price: null,
              priceRange: null,
              dateSort: null,
              dateRange: null,
              category: []
            };
            this.cdr.detectChanges();
          });
        });
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onPriceChange(optionId: string, checked: boolean): void {
    this.activeFilters.price = checked ? optionId : null;
    this.applyFilters();
  }

  onDateChange(optionId: string, checked: boolean): void {
    const isSort = optionId === 'date_1' || optionId === 'date_2';
    if (isSort) {
      this.activeFilters.dateSort = checked ? optionId : null;
    } else {
      this.activeFilters.dateRange = checked ? optionId : null;
    }
    this.applyFilters();
  }

  onCategoryChange(label: string, checked: boolean): void {
    if (checked) {
      this.activeFilters.category.push(label.toLowerCase());
    } else {
      this.activeFilters.category = this.activeFilters.category.filter(c => c !== label.toLowerCase());
    }
    this.applyFilters();
  }

  onRangeChange(min: number, max: number): void {
    this.activeFilters.priceRange = { min, max };
    this.applyFilters();
  }

  isPriceFilter(filter: Filter): boolean {
    return filter.id === 'filter_price';
  }

  isCategoryFilter(filter: Filter): boolean {
    return filter.id === 'filter_category';
  }

  isDateFilter(filter: Filter): boolean {
    return filter.id === 'filter_date';
  }

  isDateSort(optionId: string): boolean {
    return optionId === 'date_1' || optionId === 'date_2';
  }

  private parsePrice(price: string): number {
    return parseFloat(price.replace(',', '.').replace('€', '').trim());
  }

  private applyFilters(): void {
    let results = [...this.allProducts];

    if (this.activeFilters.category.length > 0) {
      results = results.filter(p =>
        this.activeFilters.category.includes(p.category.toLowerCase())
      );
    }

    if (this.activeFilters.priceRange) {
      results = results.filter(p => {
        const price = this.parsePrice(p.price);
        return price >= this.activeFilters.priceRange!.min &&
          price <= this.activeFilters.priceRange!.max;
      });
    }

    if (this.activeFilters.price) {
      results.sort((a, b) => {
        const pa = this.parsePrice(a.price);
        const pb = this.parsePrice(b.price);
        return this.activeFilters.price === 'price_1' ? pa - pb : pb - pa;
      });
    }

    if (this.activeFilters.dateRange) {
      const now = new Date();
      results = results.filter(p => {
        const d = new Date(p.dateAdded);
        if (this.activeFilters.dateRange === 'date_3') {
          return d.toDateString() === now.toDateString();
        }
        if (this.activeFilters.dateRange === 'date_4') {
          return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
        if (this.activeFilters.dateRange === 'date_5') {
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }
        if (this.activeFilters.dateRange === 'date_6') {
          return d.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    if (this.activeFilters.dateSort) {
      results.sort((a, b) =>
        this.activeFilters.dateSort === 'date_1'
          ? new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          : new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      );
    }

    this.filteredProducts = results;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
