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

  constructor(
    private productsService: ProductsService,
  ) { }

  ngOnInit(): void {
    this.loadBestSaleProducts();
  }


  loadBestSaleProducts(): void {
    this.loading = true;
    this.error = null;
    this.productsService
      .getFeaturedProducts( {
        limit: 4,
        with_images: true,
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
