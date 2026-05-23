import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Product } from '../../models/product/product.interface';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss',
})
export class ProductInfo {
  @Input() product!: Product;
}
