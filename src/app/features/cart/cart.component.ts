import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfirmationModalComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  showRemoveConfirmation = false;
  selectedItem: CartItem | null = null;
  isAuthenticated = false;
  cartItems: CartItem[] = [];
  cartTotal = 0;

  currentCart: any;

  constructor(
    private _authService: AuthService,
    private _cartService: CartService
  ) {
    this.isAuthenticated = this._authService.isAuthenticated();
    this._cartService.cartItems$.subscribe((cart: CartItem[]) => {
      console.clear();
      console.log(cart);
      this.cartItems = cart;
    });
    this._cartService.cartTotal$.subscribe((total: number) => {
      this.cartTotal = total;
    });
    this._cartService.getCurrentCart().subscribe((cart: any) => {
      console.clear();
      console.log(cart);
      this.currentCart = cart;
    });
  }

  ngOnInit(): void {
  }

  incrementQuantity(item: CartItem): void {
    console.log(item);
    this._cartService.updateCartItem(item.id, item.quantity + 1, item.product_id);
  }

  decrementQuantity(item: CartItem): void {
    console.log(item);
    if (item.quantity > 1) {
      this._cartService.updateCartItem(item.id, item.quantity - 1, item.product_id);
    } else if (item.quantity === 1) {
      this._cartService.removeCartItem(item.id);
    }
  }

  // Afficher le modal de confirmation
  showRemoveConfirmModal(item: CartItem): void {
    this.selectedItem = item;
    this.showRemoveConfirmation = true;
  }

  // Fermer le modal sans action
  cancelRemove(): void {
    this.showRemoveConfirmation = false;
  }

  // Confirmer la suppression
  confirmRemove(): void {
    this.removeFromCart();
    this.showRemoveConfirmation = false;
  }

  removeFromCart(): void {
    if (this.selectedItem) {
      this._cartService
        .removeCartItem(this.selectedItem.id, this.selectedItem.product_id)
        .subscribe(
          () => {
            // Suppression réussie

          },
          error => {
            console.error('Erreur lors de la suppression du panier', error);
          }
        );
    }
  }
}
