import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
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
      this.cartItems = cart;
    });
    this._cartService.cartTotal$.subscribe((total: number) => {
      this.cartTotal = total;
      });
    this._cartService.getCurrentCart().subscribe((cart: any) => {
      console.log(cart);
      this.currentCart = cart;
    });
  }

  ngOnInit(): void {
  }

}
