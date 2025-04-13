import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, timestamp } from 'rxjs/operators';
import { ApiClientService } from './api-client.service';
import { AuthService } from './auth.service';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: any; // Données du produit
}

export interface LocalCart {
  items: CartItem[];
  itemsCount: number;
  total: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService extends ApiClientService {
  // BehaviorSubject pour suivre l'état du panier
  private cartItemsCount = new BehaviorSubject<number>(0);
  private cartTotal = new BehaviorSubject<number>(0);
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  // Observables publics exposés aux composants
  public cartItemsCount$ = this.cartItemsCount.asObservable();
  public cartTotal$ = this.cartTotal.asObservable();
  public cartItems$ = this.cartItems.asObservable();

  private isAuthenticated = false;

  constructor(private authService: AuthService) {
    super();
    this.baseUrl = 'client/cart'; // Base URL pour les endpoints du panier
    this.isAuthenticated = this.authService.isAuthenticated();
    // Écouter les changements d'état d'authentification
    this.authService.isAuthenticated$.subscribe(isAuth => {
      const wasAuthenticated = this.isAuthenticated;
      this.isAuthenticated = isAuth;

      // Si l'utilisateur vient de se connecter, synchroniser le panier local
      if (isAuth && !wasAuthenticated) {
        this.syncLocalCartWithServer();
      }

      this.loadCartState();
    });

    this.loadCartState();
  }

  /**
   * Charge l'état du panier (local ou serveur selon authentification)
   */
  private loadCartState(): void {
    if (this.isAuthenticated) {
      // Si authentifié, charger depuis le serveur
      this.getCurrentCart().subscribe();
    } else {
      // Sinon, charger depuis le sessionStorage
      const localCart = this.getLocalCart();
      this.updateCartState(
        localCart.itemsCount || 0,
        localCart.total || 0,
        localCart.items || []
      );
    }
  }

  /**
   * Récupère le panier local depuis le sessionStorage
   */
  private getLocalCart(): LocalCart {
    try {
      const cartData = this.getSessionItem('local_cart');
      if (cartData && Object.keys(cartData).length > 0) {
        return cartData;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du panier local', e);
    }
    return { items: [], itemsCount: 0, total: 0, timestamp: Date.now() };
  }

  /**
   * Sauvegarde le panier local dans le sessionStorage
   */
  private saveLocalCart(cart: LocalCart): void {
    try {
      this.setSessionItem('local_cart', cart);
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du panier local', e);
    }
  }

  /**
   * Met à jour l'état du panier
   */
  private updateCartState(itemsCount: number, total: number, items: CartItem[] = []): void {
    this.cartItemsCount.next(itemsCount);
    this.cartTotal.next(total);
    this.cartItems.next(items);

    if (!this.isAuthenticated) {
      // Sauvegarder dans sessionStorage si non authentifié
      this.saveLocalCart({
        items,
        itemsCount,
        total,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Synchronise le panier local avec le serveur après connexion
   */
  private syncLocalCartWithServer(): Observable<any> {
    const localCart = this.getLocalCart();

    if (!localCart.items || localCart.items.length === 0) {
      return of(null);
    }

    // Pour chaque article du panier local, l'ajouter au panier serveur
    const addPromises = localCart.items.map(item =>
      this.post('items', {
        product_id: item.product_id,
        quantity: item.quantity,
        replace: true
      }).toPromise()
    );

    return of(Promise.all(addPromises)).pipe(
      tap(() => {
        // Vider le panier local après synchronisation
        this.saveLocalCart({ items: [], itemsCount: 0, total: 0, timestamp: Date.now() });
        // Rafraîchir l'état du panier depuis le serveur
        this.getCurrentCart().subscribe();
      })
    );
  }

  /**
   * Récupère le panier actuel (du serveur si authentifié, sinon local)
   */
  getCurrentCart(): Observable<any> {
    if (!this.isAuthenticated) {
      // Si non authentifié, retourner le panier local
      const localCart = this.getLocalCart();
      return of({
        data: {
          items: localCart.items,
          items_count: localCart.itemsCount,
          total_amount: localCart.total
        }
      });
    }

    // Si authentifié, récupérer depuis le serveur
    return this.get('', {}).pipe(
      tap((response: any) => {
        if (response && response.data) {
          const items = response.data.items || [];
          this.updateCartState(
            response.data.items_count || 0,
            response.data.total_amount || 0,
            items
          );
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du panier', error);
        return of(null);
      })
    );
  }

  /**
   * Ajoute un produit au panier
   */
  addToCart(productId: string, quantity: number = 1, replace: boolean = false, productData?: any): Observable<any> {
    if (!this.isAuthenticated) {
      // Si non authentifié, ajouter au panier local
      const localCart = this.getLocalCart();
      const existingItemIndex = localCart.items.findIndex(item => item.product_id === productId);

      if (existingItemIndex !== -1) {
        // Produit déjà dans le panier
        if (replace) {
          localCart.items[existingItemIndex].quantity = quantity;
        } else {
          localCart.items[existingItemIndex].quantity += quantity;
        }
      } else {
        // Nouveau produit
        localCart.items.push({
          id: Date.now().toString(),
          product_id: productId,
          quantity,
          product: productData
        });
      }

      // Recalculer les totaux
      this.recalculateLocalCart(localCart);
      this.saveLocalCart(localCart);

      this.updateCartState(
        localCart.itemsCount,
        localCart.total,
        localCart.items
      );

      return of({ success: true });
    }

    // Si authentifié, utiliser l'API
    return this.post('items', {
      product_id: productId,
      quantity,
      replace
    }).pipe(
      tap(() => {
        // Après l'ajout, rafraîchir les totaux du panier
        this.getCartTotal().subscribe();
      }),
      catchError(error => {
        console.error('Erreur lors de l\'ajout au panier', error);
        return of({ success: false, error });
      })
    );
  }

  /**
   * Met à jour la quantité d'un article dans le panier
   */
  updateCartItem(cartItemId: string, quantity: number, productId?: string): Observable<any> {
    if (!this.isAuthenticated && productId) {
      // Si non authentifié, mettre à jour dans le panier local
      const localCart = this.getLocalCart();
      const itemIndex = localCart.items.findIndex(item => item.product_id === productId);

      if (itemIndex !== -1) {
        localCart.items[itemIndex].quantity = quantity;
        this.recalculateLocalCart(localCart);
        this.saveLocalCart(localCart);

        this.updateCartState(
          localCart.itemsCount,
          localCart.total,
          localCart.items
        );
      }

      return of({ success: true });
    }

    // Si authentifié, utiliser l'API
    return this.put(`items/${cartItemId}`, {
      quantity
    }).pipe(
      tap(() => {
        // Après la mise à jour, rafraîchir les totaux du panier
        this.getCartTotal().subscribe();
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour du panier', error);
        return of({ success: false, error });
      })
    );
  }

  /**
   * Supprime un article du panier
   */
  removeCartItem(cartItemId: string, productId?: string): Observable<any> {
    if (!this.isAuthenticated && productId) {
      // Si non authentifié, supprimer du panier local
      const localCart = this.getLocalCart();
      localCart.items = localCart.items.filter(item => item.product_id !== productId);

      this.recalculateLocalCart(localCart);
      this.saveLocalCart(localCart);

      this.updateCartState(
        localCart.itemsCount,
        localCart.total,
        localCart.items
      );

      return of({ success: true });
    }

    // Si authentifié, utiliser l'API
    return this.delete(`items/${cartItemId}`).pipe(
      tap(() => {
        // Après la suppression, rafraîchir les totaux du panier
        this.getCartTotal().subscribe();
      }),
      catchError(error => {
        console.error('Erreur lors de la suppression du panier', error);
        return of({ success: false, error });
      })
    );
  }

  /**
   * Vide le panier
   */
  clearCart(): Observable<any> {
    if (!this.isAuthenticated) {
      // Si non authentifié, vider le panier local
      const emptyCart = { items: [], itemsCount: 0, total: 0, timestamp: Date.now() };
      this.saveLocalCart(emptyCart);
      this.updateCartState(0, 0, []);
      return of({ success: true });
    }

    // Si authentifié, utiliser l'API
    return this.delete('clear').pipe(
      tap(() => {
        // Après avoir vidé le panier, mettre à jour l'état
        this.updateCartState(0, 0, []);
      }),
      catchError(error => {
        console.error('Erreur lors du vidage du panier', error);
        return of({ success: false, error });
      })
    );
  }

  /**
   * Récupère le total du panier
   */
  getCartTotal(): Observable<any> {
    if (!this.isAuthenticated) {
      // Si non authentifié, calculer depuis le panier local
      const localCart = this.getLocalCart();
      return of({
        items_count: localCart.itemsCount,
        total_amount: localCart.total
      });
    }

    // Si authentifié, utiliser l'API
    return this.get('total', {}).pipe(
      tap((response: any) => {
        if (response) {
          this.cartItemsCount.next(response.items_count || 0);
          this.cartTotal.next(response.total_amount || 0);
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du total', error);
        return of({ items_count: 0, total_amount: 0 });
      })
    );
  }

  /**
   * Recalcule les totaux du panier local
   */
  private recalculateLocalCart(localCart: LocalCart): void {
    localCart.itemsCount = localCart.items.reduce((total, item) => total + item.quantity, 0);

    // Calcul du total basé sur les prix des produits si disponibles
    if (localCart.items.every(item => item.product && (item.product.sale_price !== undefined || item.product.price !== undefined))) {
      localCart.total = localCart.items.reduce((total, item) => {
        const price = item.product.sale_price !== undefined ? item.product.sale_price : item.product.price;
        return total + (price * item.quantity);
      }, 0);
    } else {
      // Total fictif si les prix ne sont pas disponibles
      localCart.total = 0;
    }
  }

  /**
   * Vérifie si le panier est vide
   */
  isCartEmpty(): boolean {
    return this.cartItemsCount.value === 0;
  }

  /**
   * Obtient le nombre d'articles dans le panier
   */
  getCartItemsCount(): number {
    return this.cartItemsCount.value;
  }

  /**
   * Obtient le montant total du panier
   */
  getCartTotalAmount(): number {
    return this.cartTotal.value;
  }

  /**
   * Obtient tous les articles du panier
   */
  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }
}
