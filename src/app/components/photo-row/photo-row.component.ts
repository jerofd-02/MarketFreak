import {Component, Input} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Product} from '../../models/product/product.interface';
import {AddProductButton} from '../../models/profile/profile.interface';

@Component({
  selector: 'app-photo-row',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './photo-row.component.html',
  styleUrl: './photo-row.component.scss',
})
export class PhotoRow {
  @Input() products: Product[] = [];
  @Input() addProductButton: AddProductButton | null = null;
}
