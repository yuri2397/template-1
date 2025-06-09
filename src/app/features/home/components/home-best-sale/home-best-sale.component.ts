import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../../core/services/products.service';
import { CartService } from '../../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  sale_price: string;
  discount_percentage: number;
  thumbnail_url: string;
  category?: {
    id: string;
    name: string;
  };
  stock_quantity: number;
  in_stock: boolean;
}

@Component({
  selector: 'app-home-best-sale',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home-best-sale.component.html',
  styleUrl: './home-best-sale.component.scss'
})
export class HomeBestSaleComponent implements OnInit {
  bestSaleProducts: Product[] = [];
  loading = false;
  error: string | null = null;
  favorites: Set<string> = new Set();

  constructor(
    private productsService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadBestSaleProducts();
    this.loadFavorites();
  }

  loadBestSaleProducts(): void {
    this.loading = true;
    this.error = null;

    this.productsService
      .getFeaturedProducts({
        limit: 4,
        with_images: true,
        with_category: true,
        with_discount: true
      })
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          this.bestSaleProducts = response?.data || [];
          console.log('Best sale products loaded:', this.bestSaleProducts);
        },
        error: (err) => {
          console.error('Error loading best sale products:', err);
          this.error = 'Impossible de charger les produits en vedette. Veuillez réessayer plus tard.';
        }
      });
  }

  loadFavorites(): void {
    try {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        this.favorites = new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  saveFavorites(): void {
    try {
      localStorage.setItem('favorites', JSON.stringify([...this.favorites]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  toggleFavorite(product: Product): void {
    if (this.favorites.has(product.id)) {
      this.favorites.delete(product.id);
    } else {
      this.favorites.add(product.id);
    }
    this.saveFavorites();
  }

  isFavorite(productId: string): boolean {
    return this.favorites.has(productId);
  }

  addToCart(product: Product): void {
    if (!product.in_stock || product.stock_quantity <= 0) {
      this.showMessage('Ce produit n\'est plus en stock', 'error');
      return;
    }

    this.cartService.addToCart(product.id, 1, false, product).subscribe({
      next: () => {
        this.showMessage(`${product.name} ajouté au panier`, 'success');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.showMessage('Erreur lors de l\'ajout au panier', 'error');
      }
    });
  }

  quickView(product: Product): void {
    // Implémenter la logique de vue rapide
    console.log('Quick view for product:', product);
    // Ici vous pouvez ouvrir un modal ou naviguer vers la page détail
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    // Implémenter un système de notification toast
    console.log(`${type}: ${message}`);

    // Exemple simple avec alert (à remplacer par un vrai système de toast)
    if (type === 'success') {
      // Créer un toast success
      this.createToast(message, 'success');
    } else {
      // Créer un toast error
      this.createToast(message, 'error');
    }
  }

  private createToast(message: string, type: string): void {
    // Créer dynamiquement un toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#28a745' : '#dc3545'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Suppression automatique
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  retryLoad(): void {
    this.loadBestSaleProducts();
  }
}