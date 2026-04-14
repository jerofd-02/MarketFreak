import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PhotoRow} from '../photo-row/photo-row';
import {Carousel} from '../carousel/carousel';
import {CarouselItem, Product} from '../../models/product/product.interface';
import {IndexService} from '../../services/index.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Carousel, PhotoRow],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  carousel: CarouselItem | null = null;
  mainTitle: string = '';
  products: Product[] = [];

  constructor(private indexService: IndexService, private cdr: ChangeDetectorRef) {
  }

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
