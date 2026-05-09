import {ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {CarouselItem} from '../../models/product/product.interface';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  standalone: true
})
export class CarouselComponent implements OnChanges, OnDestroy {
  @Input() carousel: CarouselItem | null = null;
  currentSlide: number = 0;
  private intervalId: any = null;
  isVisible: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

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

  @HostListener('mouseenter') onMouseEnter() {
    this.stopAutoplay();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.startAutoplay();
  }

  startAutoplay(): void {
    this.intervalId = setInterval(() => {
      this.transition((this.currentSlide + 1) % this.carousel!.images.length);
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
    this.transition(index);
    this.startAutoplay();
  }

  private transition(index: number): void {
    this.isVisible = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.currentSlide = index;
      this.isVisible = true;
      this.cdr.detectChanges();
    }, 3400);
  }
}
