import {Component, Input} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Product} from '../../models/product/product.interface';

@Component({
  selector: 'app-photo-row',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './photo-row.html',
  styleUrl: './photo-row.css',
})
export class PhotoRow {
  @Input() products: Product[] = [];
}
