import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
      CommonModule,
      RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  categories: any[] = [];
  isCategoriesDropdownOpen = false;
  isMenuOpen = false;
  constructor(
    private _categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this._categoriesService
      .getCategories({
        limit: 10,
        with_products_count: true
      })
      .subscribe((categories) => {
        this.categories = categories?.data || [];
      });
  }
}
