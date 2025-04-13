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

  private cartSubscription: Subscription | null = null;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.maxQuantity = this.product.stock_quantity;

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

  addToCart(): void {
    // Si le produit est déjà dans le panier, incrémenter la quantité
    if (this.inCart && this.cartItemId) {
      this.updateQuantity(this.cartQuantity + 1);
    } else {
      // Sinon, ajouter le produit au panier
      this.cartService.addToCart(this.product.id, 1, false, this.product).subscribe(
        () => {
          // Mise à jour réussie
        },
        error => {
          console.error('Erreur lors de l\'ajout au panier', error);
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
        }
      );
    }
  }

  incrementQuantity(): void {
    if (this.cartQuantity < this.maxQuantity) {
      this.updateQuantity(this.cartQuantity + 1);
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
        },
        error => {
          console.error('Erreur lors de la suppression du panier', error);
        }
      );
    }
  }
}