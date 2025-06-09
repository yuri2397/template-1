import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Category } from '../../core/models/category.model';
import { ProductsService } from '../../core/services/products.service';
import { Product, ProductItemComponent } from '../../shared/components/product-item/product-item.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    ProductItemComponent
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  categories: Category[] = [];
  loadingCategories: boolean = false;
  currentCategoryId: string | null = null;
  selectedCategory: Category | null = null;
  isFiltersOpen: boolean = false;

  products: Product[] = [];
  loadingProducts: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;

  productParams: any = {
    page: 1,
    limit: 12,
    search: '',
    with_images: 1,
    with_category: 1,
    freshness: 1,
  }

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category_id']) {
        this.currentCategoryId = params['category_id'];
      } else {
        delete this.productParams['category_id'];
      }

      if (params['page']) {
        this.currentPage = parseInt(params['page']);
        this.productParams['page'] = this.currentPage;
      }

      this.getProducts();
    });

    this.getCategories();
  }

  getProducts() {
    this.loadingProducts = true;

    if (this.currentCategoryId) {
      this.productParams['category_id'] = this.currentCategoryId;
    }

    this.productsService
      .searchProducts(this.productParams.search, this.productParams)
      .pipe(
        finalize(() => this.loadingProducts = false)
      ).subscribe({
        next: (response: any) => {
          this.products = response?.data || [];
          // this.showMessage(`${this.products.length} produits trouvés`, 'info');
        },
        error: (error) => {
          console.error('Erreur lors du chargement des produits', error);
          this.showMessage('Erreur lors du chargement des produits', 'error');
        }
      });
  }

  getCategories() {
    this.loadingCategories = true;

    this.categoriesService
      .getCategoryTree()
      .pipe(
        finalize(() => this.loadingCategories = false)
      )
      .subscribe({
        next: (categories) => {
          this.categories = categories?.data || [];

          if (this.currentCategoryId) {
            const category = this.categories.find(c => c.id === this.currentCategoryId);
            if (category) {
              this.toggleCategory(category);
            }
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement des catégories', error);
          this.showMessage('Erreur lors du chargement des catégories', 'error');
        }
      });
  }

  toggleCategory(category: Category) {
    this.categories.forEach(c => {
      c.collapsed = false;
    });

    category.collapsed = !category.collapsed;
    this.selectedCategory = category;
    this.productParams['category_id'] = category.id;
    this._refreshProducts();
  }

  selectFilter(category: any) {
    this.selectedCategory = category;
    this.productParams['category_id'] = category.id;
    this._refreshProducts();
    this.closeFilters();
  }

  clearFilters() {
    this.productParams['category_id'] = null;
    this.selectedCategory = null;
    this.categories.forEach(c => {
      c.collapsed = false;
    });
    this._refreshProducts();
    this.closeFilters();
  }

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  closeFilters() {
    this.isFiltersOpen = false;
  }

  goToPage(page: number) {
    if (page < 1) return;

    this.currentPage = page;
    this.productParams['page'] = page;
    this._refreshProducts();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private _refreshProducts() {
    this.productParams['freshness'] = Math.random();

    const queryParams: any = {
      ...this.productParams
    };

    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    this.router.navigate(['/catalog'], {
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
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