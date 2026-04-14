import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CarouselItem, Product} from '../../models/product/product.interface';
import {IndexService} from '../../services/index.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  carousel: CarouselItem | null = null;
  mainTitle: string = '';
  products: Product[] = [];
  currentSlide: number = 0;

  constructor(private indexService: IndexService) {
  }

  ngOnInit(): void {
    this.indexService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.startAutoplay();
      }
    });

    this.indexService.getRandomProducts().subscribe({
      next: (products) => this.products = products
    });
  }

  startAutoplay(): void {
    setInterval(() => {
      if (this.carousel) {
        this.currentSlide = (this.currentSlide + 1) % this.carousel.images.length;
      }
    }, 3000);
  }

  setSlide(index: number): void {
    this.currentSlide = index;
  }
}
