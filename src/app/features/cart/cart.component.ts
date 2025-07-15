import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
    private _cartService: CartService,
    private _router: Router
  ) {
    this.isAuthenticated = this._authService.isAuthenticated();

    this._cartService.cartItems$.subscribe((cart: CartItem[]) => {
      this.cartItems = cart;
    });

    this._cartService.cartTotal$.subscribe((total: number) => {
      this.cartTotal = total;
    });

    this._cartService.getCurrentCart().subscribe((cart: any) => {
      this.currentCart = cart;
    });
  }

  ngOnInit(): void {
  }

  incrementQuantity(item: CartItem): void {
    this._cartService.updateCartItem(item.id, item.quantity + 1, item.product_id).subscribe({
      next: () => {
        this.showMessage('Quantité mise à jour', 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour', error);
        this.showMessage('Erreur lors de la mise à jour', 'error');
      }
    });
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this._cartService.updateCartItem(item.id, item.quantity - 1, item.product_id).subscribe({
        next: () => {
          this.showMessage('Quantité mise à jour', 'success');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour', error);
          this.showMessage('Erreur lors de la mise à jour', 'error');
        }
      });
    } else if (item.quantity === 1) {
      this.showRemoveConfirmModal(item);
    }
  }

  showRemoveConfirmModal(item: CartItem): void {
    this.selectedItem = item;
    this.showRemoveConfirmation = true;
  }

  cancelRemove(): void {
    this.showRemoveConfirmation = false;
    this.selectedItem = null;
  }

  confirmRemove(): void {
    if (this.selectedItem) {
      this._cartService.removeCartItem(this.selectedItem.id, this.selectedItem.product_id).subscribe({
        next: () => {
          this.showMessage(`${this.selectedItem?.product.name} retiré du panier`, 'success');
          this.showRemoveConfirmation = false;
          this.selectedItem = null;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          this.showMessage('Erreur lors de la suppression', 'error');
        }
      });
    }
  }

  clearCart(): void {
    this._cartService.clearCart().subscribe({
      next: () => {
        this.showMessage('Panier vidé avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur lors du vidage du panier', error);
        this.showMessage('Erreur lors du vidage du panier', 'error');
      }
    });
  }

  goToCheckout(): void {
    if(this.isAuthenticated) {
      this._router.navigate(['/checkout']);
    } else {
      this._router.navigate(['/login']);
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
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

    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }
}