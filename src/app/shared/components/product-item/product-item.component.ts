import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../core/models/category.model';
import { CartService } from '../../../core/services/cart.service';
import { Subscription } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  sale_price: string;
  sku: string;
  stock_quantity: number;
  in_stock: boolean;
  discount_percentage: number;
  category_id: string;
  category: Category;
  is_active: boolean;
  is_featured: boolean;
  is_on_sale: null;
  thumbnail_url: string;
  thumbnail_thumb_url: string;
  images: Image[];
  main_image_url: null;
  created_at: Date;
  updated_at: Date;
  rating?: number;
  reviews_count?: number;
}

export interface Image {
  id: number;
  url: string;
}

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent implements OnInit, OnDestroy {
  @Input() product!: Product;

  inCart: boolean = false;
  cartQuantity: number = 0;
  cartItemId: string | null = null;
  maxQuantity: number = 1;
  favorites: Set<string> = new Set();

  private cartSubscription: Subscription | null = null;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.maxQuantity = this.product.stock_quantity;
    this.loadFavorites();

    // S'abonner aux changements du panier
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      // Vérifier si le produit est dans le panier
      const cartItem = items.find(item => item.product_id === this.product.id);

      this.inCart = !!cartItem;
      this.cartQuantity = cartItem ? cartItem.quantity : 1;
      this.cartItemId = cartItem ? cartItem.id : null;
    });

    // Charger l'état initial du panier
    this.cartService.getCurrentCart().subscribe();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  getProductImage1(product: Product): string {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return product.thumbnail_url || 'assets/images/placeholder.jpg';
  }

  getProductImage2(product: Product): string {
    if (product.images && product.images.length > 1) {
      return product.images[1].url;
    }
    return product.thumbnail_url || 'assets/images/placeholder.jpg';
  }

  isNewProduct(): boolean {
    if (!this.product.created_at) return false;
    const createdDate = new Date(this.product.created_at);
    const daysDiff = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30; // Consider products newer than 30 days as "new"
  }

  isLowStock(): boolean {
    return this.product.in_stock && this.product.stock_quantity <= 5 && this.product.stock_quantity > 0;
  }

  hasRating(): boolean {
    return !!(this.product.rating && this.product.rating > 0);
  }

  getRating(): number {
    return this.product.rating || 0;
  }

  getReviewsCount(): number {
    return this.product.reviews_count || 0;
  }

  getSavings(): number {
    const price = parseFloat(this.product.price);
    const salePrice = parseFloat(this.product.sale_price);
    return price - salePrice;
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

  isFavorite(): boolean {
    return this.favorites.has(this.product.id);
  }

  toggleFavorite(): void {
    if (this.favorites.has(this.product.id)) {
      this.favorites.delete(this.product.id);
      this.showMessage(`${this.product.name} retiré des favoris`, 'info');
    } else {
      this.favorites.add(this.product.id);
      this.showMessage(`${this.product.name} ajouté aux favoris`, 'success');
    }
    this.saveFavorites();
  }

  quickView(): void {
    // Implementation for quick view modal
    console.log('Quick view for product:', this.product);
    this.showMessage('Vue rapide - Fonctionnalité bientôt disponible', 'info');
  }

  addToCart(): void {
    // Si le produit est déjà dans le panier, incrémenter la quantité
    if (this.inCart && this.cartItemId) {
      this.updateQuantity(this.cartQuantity + 1);
    } else {
      // Sinon, ajouter le produit au panier
      this.cartService.addToCart(this.product.id, 1, false, this.product).subscribe(
        () => {
          this.showMessage(`${this.product.name} ajouté au panier`, 'success');
        },
        error => {
          console.error('Erreur lors de l\'ajout au panier', error);
          this.showMessage('Erreur lors de l\'ajout au panier', 'error');
        }
      );
    }
  }

  updateQuantity(newQuantity: number): void {
    // Vérifier que la nouvelle quantité est valide
    if (newQuantity < 1 || newQuantity > this.maxQuantity) {
      return;
    }

    if (this.inCart && this.cartItemId) {
      // Mettre à jour la quantité d'un article existant
      this.cartService.updateCartItem(this.cartItemId, newQuantity, this.product.id).subscribe(
        () => {
          // Mise à jour réussie
        },
        error => {
          console.error('Erreur lors de la mise à jour de la quantité', error);
          this.showMessage('Erreur lors de la mise à jour', 'error');
        }
      );
    } else if (newQuantity > 0) {
      // Ajouter au panier avec la quantité spécifiée
      this.cartService.addToCart(this.product.id, newQuantity, false, this.product).subscribe(
        () => {
          // Ajout réussi
        },
        error => {
          console.error('Erreur lors de l\'ajout au panier', error);
          this.showMessage('Erreur lors de l\'ajout au panier', 'error');
        }
      );
    }
  }

  incrementQuantity(): void {
    if (this.cartQuantity < this.maxQuantity) {
      this.updateQuantity(this.cartQuantity + 1);
    } else {
      this.showMessage('Quantité maximale atteinte', 'warning');
    }
  }

  decrementQuantity(): void {
    if (this.cartQuantity > 1) {
      this.updateQuantity(this.cartQuantity - 1);
    } else if (this.cartQuantity === 1 && this.cartItemId) {
      // Si la quantité est 1 et qu'on décrémente, on supprime l'article du panier
      this.removeFromCart();
    }
  }

  removeFromCart(): void {
    if (this.cartItemId) {
      this.cartService.removeCartItem(this.cartItemId, this.product.id).subscribe(
        () => {
          // Suppression réussie
          this.inCart = false;
          this.cartQuantity = 1;
          this.cartItemId = null;
          this.showMessage(`${this.product.name} retiré du panier`, 'info');
        },
        error => {
          console.error('Erreur lors de la suppression du panier', error);
          this.showMessage('Erreur lors de la suppression', 'error');
        }
      );
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    // Créer un toast notification
    this.createToast(message, type);
  }

  private createToast(message: string, type: string): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const colors = {
      success: '#28a745',
      error: '#dc3545',
      info: '#17a2b8',
      warning: '#ffc107'
    };

    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type as keyof typeof colors] || colors.info};
      color: ${type === 'warning' ? '#212529' : 'white'};
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
      font-size: 0.9rem;
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
}