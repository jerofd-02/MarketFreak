import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CarouselItem, Product} from '../../models/product/product.interface';
import {IndexService} from '../../services/index.service';
import {CarouselComponent} from '../../components/carousel/carousel.component';
import {PhotoRow} from '../../components/photo-row/photo-row.component';
import {PageLayoutComponent} from '../../components/page-layout/page-layout.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CarouselComponent, PhotoRow, PageLayoutComponent],
})
export class HomePage implements OnInit {
  carousel: CarouselItem | null = null;
  mainTitle: string = '';
  products: Product[] = [];

  constructor(
    private indexService: IndexService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.indexService.getCarousel().subscribe({
      next: (data) => {
        this.carousel = data;
        this.cdr.detectChanges();
      }
    });

    this.indexService.getMainTitle().subscribe({
      next: (title) => {
        this.mainTitle = title;
        this.cdr.detectChanges();
      }
    });

    this.indexService.getRandomProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.cdr.detectChanges();
      }
    });
  }
}
