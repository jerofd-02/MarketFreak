import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {CarouselItem} from '../../models/product/product.interface';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent implements OnChanges, OnDestroy {
  @Input() carousel: CarouselItem | null = null;
  currentSlide: number = 0;
  private intervalId: any = null;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['carousel'] && this.carousel) {
      this.currentSlide = 0;
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay(): void {
    this.intervalId = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.carousel!.images.length;
      this.cdr.detectChanges();
    }, 3000);
  }

  stopAutoplay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setSlide(index: number): void {
    if (index === this.currentSlide) return;
    this.currentSlide = index;
    this.stopAutoplay();
    this.startAutoplay();
    this.cdr.detectChanges();
  }
}
