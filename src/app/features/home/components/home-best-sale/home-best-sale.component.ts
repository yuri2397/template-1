import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../../core/services/products.service';
import { Category } from '../../../../core/models/category.model';
import { CategoriesService } from '../../../../core/services/categories.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home-best-sale',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home-best-sale.component.html',
  styleUrl: './home-best-sale.component.scss'
})
export class HomeBestSaleComponent implements OnInit {
  bestSaleProducts: any[] = [];
  loading = false;
  error: string | null = null;

  // CATEGORIES
  categoryList: Category[] = [];
  categoryLoading = false;
  categoryError: string | null = null;
  currentCategory: Category | null = null;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryLoading = true;
    this.categoriesService
      .getCategories({
        limit: 5,
        with_products_count: true
      })

      .subscribe({
        next: (categories) => {
          console.log(categories);
          this.categoryList = categories?.data || [];
          this.categoryLoading = false;
          if (this.categoryList.length > 0) {
            this.currentCategory = this.categoryList[0];
            this.loadBestSaleProducts();
          }
        },
        error: (error) => {
          this.categoryError = error;
          this.categoryLoading = false;
        }
      });
  }

  loadBestSaleProducts(): void {
    this.loading = true;
    this.error = null;
    this.productsService
      .getProductsByCategorySlug(this.currentCategory!.slug!, {
        limit: 5,
        with_images: true,
        with_products_count: true
      }).subscribe({
        next: (products) => {
          this.bestSaleProducts = products?.data || [];
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      })
  }

}
