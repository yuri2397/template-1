import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriesService } from '../../../../core/services/categories.service';
import { Category } from '../../../../core/models/category.model';
@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.scss'
})
export class HomeCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  error: string | null = null;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.categoriesService.getCategories({
      with_products_count: true,
      limit: 4
    }).subscribe({
      next: (response) => {
        this.categories = response.data;

        console.log(this.categories);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Impossible de charger les catégories. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }
}
