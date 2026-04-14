import {Component, Input, SimpleChanges} from '@angular/core';
import {CarouselItem} from '../../models/product/product.interface';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel {
  @Input() carousel: CarouselItem | null = null;
  currentSlide: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['carousel'] && this.carousel) {
      this.startAutoplay();
    }
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
