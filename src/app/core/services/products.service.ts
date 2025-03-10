import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ApiClientService {

  constructor() {
    super();
    this.baseUrl = 'client/products'; // URL correct pour les endpoints produits
  }

  /**
   * Récupère les produits mis en avant
   * @param params Paramètres de filtrage et pagination
   * @returns Observable avec les produits
   */
  getFeaturedProducts(params: {
    limit?: number;
    category_id?: string;
    with_discount?: boolean;
    with_images?: boolean;
    price_min?: number;
    price_max?: number;
  } = {}): Observable<any> {
    return this.get('featured', params);
  }

  /**
   * Récupère les détails d'un produit spécifique
   * @param productId Identifiant ou slug du produit
   * @param params Paramètres additionnels (comme with_images)
   * @returns Observable avec les détails du produit
   */
  getProductDetails(productId: string, params: {
    with_images?: boolean;
    with_related?: boolean;
  } = {}): Observable<any> {
    return this.get(`${productId}`, params);
  }

  /**
   * Récupère les produits d'une catégorie spécifique
   * @param categoryId Identifiant ou slug de la catégorie
   * @param params Paramètres de filtrage et pagination
   * @returns Observable avec les produits de la catégorie
   */
  getProductsByCategory(categoryId: string, params: {
    limit?: number;
    page?: number;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
    with_discount?: boolean;
    with_images?: boolean;
    price_min?: number;
    price_max?: number;
  } = {}): Observable<any> {
    return this.get(`category/${categoryId}`, params);
  }

  /**
   * Recherche de produits
   * @param query Terme de recherche
   * @param params Paramètres additionnels
   * @returns Observable avec les résultats de recherche
   */
  searchProducts(query: string, params: {
    limit?: number;
    page?: number;
    category_id?: string;
    with_images?: boolean;
    price_min?: number;
    price_max?: number;
  } = {}): Observable<any> {
    return this.get('search', { ...params, q: query });
  }

  /**
   * Récupère les produits récemment consultés (basé sur l'historique local)
   * @param limit Nombre maximum de produits à récupérer
   * @returns Observable avec les produits récemment consultés
   */
  getRecentlyViewedProducts(limit: number = 5): Observable<any> {
    const recentlyViewed = this.getRecentlyViewedFromStorage();

    if (recentlyViewed.length === 0) {
      return new Observable(observer => {
        observer.next({ data: [] });
        observer.complete();
      });
    }

    // On pourrait aussi implémenter un endpoint côté serveur pour faire ça
    return this.post('batch', {
      ids: recentlyViewed.slice(0, limit)
    });
  }

  /**
   * Récupère les nouveaux produits
   * @param params Paramètres de filtrage
   * @returns Observable avec les nouveaux produits
   */
  getNewProducts(params: {
    limit?: number;
    days?: number;
    category_id?: string;
    with_images?: boolean;
  } = {}): Observable<any> {
    return this.get('new', params);
  }

  /**
   * Récupère les produits en promotion
   * @param params Paramètres de filtrage
   * @returns Observable avec les produits en promotion
   */
  getProductsOnSale(params: {
    limit?: number;
    discount_min?: number;
    category_id?: string;
    with_images?: boolean;
  } = {}): Observable<any> {
    return this.get('on-sale', params);
  }

  /**
   * Récupère les produits similaires à un produit
   * @param productId Identifiant du produit
   * @param params Paramètres additionnels
   * @returns Observable avec les produits similaires
   */
  getRelatedProducts(productId: string, params: {
    limit?: number;
    with_images?: boolean;
  } = {}): Observable<any> {
    return this.get(`${productId}/related`, params);
  }

  /**
   * Récupère les commentaires d'un produit
   * @param productId Identifiant du produit
   * @param params Paramètres de pagination et filtrage
   * @returns Observable avec les commentaires
   */
  getProductComments(productId: string, params: {
    limit?: number;
    page?: number;
    rating_min?: number;
  } = {}): Observable<any> {
    return this.get(`${productId}/comments`, params);
  }

  /**
   * Ajoute un produit à l'historique des produits consultés
   * @param productId Identifiant du produit
   */
  addToRecentlyViewed(productId: string): void {
    const recentlyViewed = this.getRecentlyViewedFromStorage();

    // Éviter les doublons
    const index = recentlyViewed.indexOf(productId);
    if (index !== -1) {
      recentlyViewed.splice(index, 1);
    }

    // Ajouter au début
    recentlyViewed.unshift(productId);

    // Limiter à 20 produits
    const limitedRecentlyViewed = recentlyViewed.slice(0, 20);

    // Stocker dans le localStorage
    this.setItem('recentlyViewedProducts', limitedRecentlyViewed);
  }

  /**
   * Récupère l'historique des produits consultés depuis le stockage local
   * @returns Liste des identifiants de produits
   */
  private getRecentlyViewedFromStorage(): string[] {
    try {
      const recentlyViewed = this.getItem('recentlyViewedProducts');
      return Array.isArray(recentlyViewed) ? recentlyViewed : [];
    } catch (e) {
      return [];
    }
  }
}