import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import { Product, ProductItemComponent } from '../../../../shared/components/product-item/product-item.component';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-home-product-feature',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductItemComponent],
  templateUrl: './home-product-feature.component.html',
  styleUrl: './home-product-feature.component.scss'
})
export class HomeProductFeatureComponent implements OnInit {
  featuredProducts: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.loading = true;
    this.error = null;

    this.productsService
      .getFeaturedProducts({
        limit: 8,
        with_images: true,
        with_category: true
      })
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          this.featuredProducts = response?.data || [];
          console.log('Featured products loaded:', this.featuredProducts);
        },
        error: (err) => {
          console.error('Error loading featured products:', err);
          this.error = 'Impossible de charger les produits populaires. Veuillez réessayer plus tard.';
        }
      });
  }

  retryLoad(): void {
    this.loadFeaturedProducts();
  }
}