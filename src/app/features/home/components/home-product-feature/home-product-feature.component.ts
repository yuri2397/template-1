import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductItemComponent } from '../../../../shared/components/product-item/product-item.component';
@Component({
  selector: 'app-home-product-feature',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductItemComponent],
  templateUrl: './home-product-feature.component.html',
  styleUrl: './home-product-feature.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeProductFeatureComponent implements OnInit {
  featuredProducts: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.loading = true;
    this.error = null;

    this.productsService.getFeaturedProducts({
      limit: 8,
      with_images: true,
      with_category: true
    }).subscribe({
      next: (response) => {
        console.log(response);
        this.featuredProducts = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading featured products:', err);
        this.error = 'Impossible de charger les produits vedettes. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

}
