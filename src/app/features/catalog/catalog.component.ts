import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Category } from '../../core/models/category.model';
import { ProductsService } from '../../core/services/products.service';
import { Product, ProductItemComponent } from '../../shared/components/product-item/product-item.component';
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
export class CatalogComponent implements OnInit  {
  // categories
  categories: Category[] = [];
  loadingCategories: boolean = false;

  //products
  products: Product[] = [];
  loadingProducts: boolean = false;
  productParams = {
    page: 1,
    limit: 12,
    search: '',
    with_images: 1,
    with_category: 1
  }

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) { }
  ngOnInit(): void {
    this.getCategories();
    this.getProducts()
  }

  getProducts() {
    this.loadingProducts = true;
    this.productsService
    .searchProducts(this.productParams.search, this.productParams)
      .pipe(
        finalize(() => this.loadingProducts = false)
      ).subscribe(
        {
          next: (response: any) => {
            console.clear();
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
      console.clear();
      console.log('categories', categories.data);
      this.categories = categories.data;
      //open first category
      this.categories[0].collapsed = true;
    });
  }

  toggleCategory(category: Category) {
    this.categories.forEach(c => {
        c.collapsed = false;
    });
    category.collapsed = !category.collapsed;
  }

}
