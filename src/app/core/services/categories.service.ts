import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends ApiClientService {

  constructor() {
    super();
    this.baseUrl = 'client/categories'; // Base URL pour les endpoints de catégories
  }

  /**
   * Récupère toutes les catégories actives
   * @param params Paramètres de filtrage
   * @returns Observable avec les catégories
   */
  getCategories(params: {
    parent_id?: string;
    with_products_count?: boolean;
    with_children?: boolean;
    featured_only?: boolean;
    limit?: number;
  } = {}): Observable<any> {
    return this.get('', params);
  }

  /**
   * Récupère la structure arborescente complète des catégories
   * @param params Paramètres de filtrage
   * @returns Observable avec l'arborescence des catégories
   */
  getCategoryTree(params: {
    with_products_count?: boolean;
    active_only?: boolean;
    featured_only?: boolean;
  } = {}): Observable<any> {
    return this.get('tree', params);
  }

  /**
   * Récupère les détails d'une catégorie spécifique
   * @param categorySlug Slug de la catégorie
   * @param params Paramètres additionnels
   * @returns Observable avec les détails de la catégorie
   */
  getCategoryDetails(categorySlug: string, params: {
    with_parent?: boolean;
    with_children?: boolean;
    with_products_count?: boolean;
    with_breadcrumbs?: boolean;
  } = {}): Observable<any> {
    return this.get(`${categorySlug}`, params);
  }

  /**
   * Récupère les sous-catégories d'une catégorie
   * @param categorySlug Slug de la catégorie
   * @param params Paramètres de filtrage
   * @returns Observable avec les sous-catégories
   */
  getSubcategories(categorySlug: string, params: {
    active_only?: boolean;
    with_products_count?: boolean;
    featured_only?: boolean;
  } = {}): Observable<any> {
    return this.get(`${categorySlug}/children`, params);
  }

  /**
   * Récupère les catégories populaires
   * @param params Paramètres de limite et affichage
   * @returns Observable avec les catégories populaires
   */
  getPopularCategories(params: {
    limit?: number;
    with_images?: boolean;
  } = {}): Observable<any> {
    return this.get('popular', params);
  }

  /**
   * Récupère les catégories à partir du cache local s'il existe
   * @returns Catégories mises en cache ou null
   */
  getCachedCategories(): any[] | null {
    try {
      const cached = this.getItem('categories_cache');
      if (cached && cached.timestamp && (Date.now() - cached.timestamp < 3600000)) { // 1 heure
        return cached.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Met en cache les catégories localement
   * @param categories Données de catégories à mettre en cache
   */
  cacheCategories(categories: any[]): void {
    this.setItem('categories_cache', {
      data: categories,
      timestamp: Date.now()
    });
  }

  /**
   * Trouve une catégorie par son slug dans un tableau de catégories
   * @param categories Liste des catégories à parcourir
   * @param slug Slug de la catégorie recherchée
   * @returns La catégorie trouvée ou undefined
   */
  findCategoryBySlug(categories: any[], slug: string): any | undefined {
    for (const category of categories) {
      if (category.slug === slug) {
        return category;
      }

      // Chercher dans les enfants si présents
      if (category.children && category.children.length) {
        const found = this.findCategoryBySlug(category.children, slug);
        if (found) {
          return found;
        }
      }
    }

    return undefined;
  }

  /**
   * Récupère le chemin complet d'une catégorie (fil d'Ariane)
   * @param categorySlug Slug de la catégorie
   * @returns Observable avec le fil d'Ariane
   */
  getCategoryBreadcrumbs(categorySlug: string): Observable<any> {
    return this.getCategoryDetails(categorySlug, { with_breadcrumbs: true });
  }
}
