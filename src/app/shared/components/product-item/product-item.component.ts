import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../../core/models/category.model';
export interface Product {
  id:                  string;
  name:                string;
  description:         string;
  price:               string;
  sale_price:          string;
  sku:                 string;
  stock_quantity:      number;
  in_stock:            boolean;
  discount_percentage: number;
  category_id:         string;
  category:            Category;
  is_active:           boolean;
  is_featured:         boolean;
  is_on_sale:          null;
  thumbnail_url:       string;
  thumbnail_thumb_url: string;
  images:              Image[];
  main_image_url:      null;
  created_at:          Date;
  updated_at:          Date;
}

export interface Image {
  id:  number;
  url: string;
}

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  @Input() product!: Product;

  getProductImage1(product: Product): string {
    return product.images[0].url;
  }

  getProductImage2(product: Product): string {
    return product.images[1].url;
  }
}
