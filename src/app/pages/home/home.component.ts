import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CarouselComponent} from "../../components/carousel/carousel.component";
import {PhotoRow} from "../../components/photo-row/photo-row.component";
import {CarouselItem, Product} from '../../models/product/product.interface';
import {IndexService} from '../../services/index.service';

@Component({
  selector: 'app-home',
  imports: [
    CarouselComponent,
    PhotoRow,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
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
