import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  billing_address: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  user?: any;
  payments?: any[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: any;
}

export interface OrderFilters {
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  user_id?: string;
  min_amount?: number;
  max_amount?: number;
  date_from?: string;
  date_to?: string;
}

export interface OrderQueryParams {
  page?: number;
  perPage?: number;
  orderBy?: 'created_at' | 'total_amount' | 'status';
  orderDirection?: 'asc' | 'desc';
  with?: string[];
  filter?: OrderFilters;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiClientService {

  constructor() {
    super();
    this.baseUrl = 'orders';
  }

  /**
   * Récupère les commandes de l'utilisateur connecté
   * @param params Paramètres de pagination, tri et filtrage
   * @returns Observable avec les commandes de l'utilisateur
   */
  getMyOrders(params: {
    page?: number;
    perPage?: number;
    orderBy?: 'created_at' | 'total_amount' | 'status';
    orderDirection?: 'asc' | 'desc';
    with?: string[];
    filter?: {
      status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    };
  } = {}): Observable<any> {
    return this.get('my-orders', params);
  }

  /**
   * Récupère les détails d'une commande spécifique
   * @param orderId Identifiant de la commande
   * @param params Paramètres additionnels (relations à charger)
   * @returns Observable avec les détails de la commande
   */
  getMyOrder(orderId: string, params: {
    with?: string[];
  } = {}): Observable<any> {
    return this.get(`my-orders/${orderId}`, params);
  }

  /**
   * Crée une commande à partir du panier actuel
   * @param data Données de la commande (adresses)
   * @returns Observable avec la commande créée
   */
  createFromCart(data: {
    shipping_address: string;
    billing_address?: string;
  }): Observable<any> {
    return this.post('create-from-cart', data);
  }

  /**
   * Annule une commande
   * @param orderId Identifiant de la commande
   * @returns Observable avec la commande annulée
   */
  cancelOrder(orderId: string): Observable<any> {
    return this.post(`my-orders/${orderId}/cancel`, {});
  }

  /**
   * Récupère toutes les commandes (admin)
   * @param params Paramètres de pagination, tri, recherche et filtrage
   * @returns Observable avec la liste des commandes
   */
  getAllOrders(params: {
    page?: number;
    perPage?: number;
    search?: string;
    orderBy?: 'created_at' | 'total_amount' | 'status';
    orderDirection?: 'asc' | 'desc';
    with?: string[];
    filter?: {
      status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
      user_id?: string;
      min_amount?: number;
      max_amount?: number;
      date_from?: string;
      date_to?: string;
    };
  } = {}): Observable<any> {
    return this.get('', params);
  }

  /**
   * Récupère les détails d'une commande spécifique (admin)
   * @param orderId Identifiant de la commande
   * @param params Paramètres additionnels (relations à charger)
   * @returns Observable avec les détails de la commande
   */
  getOrder(orderId: string, params: {
    with?: string[];
  } = {}): Observable<any> {
    return this.get(orderId, params);
  }

  /**
   * Met à jour une commande (admin)
   * @param orderId Identifiant de la commande
   * @param data Données à mettre à jour
   * @returns Observable avec la commande mise à jour
   */
  updateOrder(orderId: string, data: Partial<Order>): Observable<any> {
    return this.put(orderId, data);
  }

  /**
   * Supprime une commande (admin)
   * @param orderId Identifiant de la commande
   * @returns Observable vide en cas de succès
   */
  deleteOrder(orderId: string): Observable<any> {
    return this.delete(orderId);
  }

  /**
   * Met à jour le statut d'une commande (admin)
   * @param orderId Identifiant de la commande
   * @param status Nouveau statut
   * @returns Observable avec la commande mise à jour
   */
  updateOrderStatus(orderId: string, status: Order['status']): Observable<any> {
    return this.put(`${orderId}/status`, { status });
  }

  /**
   * Récupère les statistiques des commandes (admin)
   * @param params Paramètres de filtrage par date
   * @returns Observable avec les statistiques
   */
  getOrderStats(params: {
    date_from?: string;
    date_to?: string;
  } = {}): Observable<any> {
    return this.get('stats', params);
  }
}
