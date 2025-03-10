import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-home-product-feature',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-product-feature.component.html',
  styleUrl: './home-product-feature.component.scss'
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
      with_images: true
    }).subscribe({
      next: (response) => {
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

  // Méthode pour déterminer le prix à afficher (prix normal ou prix de vente)
  getDisplayPrice(product: any): number {
    return product.sale_price || product.price;
  }

  // Méthode pour vérifier si un produit est en promotion
  hasDiscount(product: any): boolean {
    return product.sale_price && product.sale_price < product.price;
  }

  // Méthode pour calculer le pourcentage de réduction
  getDiscountPercentage(product: any): number {
    if (!this.hasDiscount(product)) return 0;
    return Math.round(((product.price - product.sale_price) / product.price) * 100);
  }
}