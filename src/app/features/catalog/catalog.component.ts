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
  // categories
  categories: Category[] = [];
  loadingCategories: boolean = false;
  currentCategoryId: string | null = null;
  selectedCategory: Category | null = null;
  //products
  products: Product[] = [];
  loadingProducts: boolean = false;
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
      ).subscribe(
        {
          next: (response: any) => {
            console.log(response.data)
            this.products = response.data;
          }
        }
      )
  }

  getCategories() {
    this.loadingCategories = true;
    this.categoriesService
      .getCategoryTree()
      .pipe(
        finalize(() => this.loadingCategories = false)
      )
      .subscribe((categories) => {
        console.log('categories', categories.data);
        this.categories = categories.data;
        if (this.currentCategoryId) {
          const category = this.categories.find(c => c.id === this.currentCategoryId);
          if (category) {
            this.toggleCategory(category);
          }
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
    this.productParams['category_id'] = category.id;
    this._refreshProducts();
  }

  _refreshProducts() {
    this.productParams['freshness'] = Math.random();
    this.router.navigate(['/catalog'], { queryParams: this.productParams, queryParamsHandling: 'merge', replaceUrl: true, });
  }

  clearFilters() {
    this.productParams['category_id'] = null;
    this.selectedCategory = null;
    this._refreshProducts();
  }
}
