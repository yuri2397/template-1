import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

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
  @ViewChild('navbar', { static: true }) navbar!: ElementRef;

  categories: any[] = [];
  isCategoriesDropdownOpen = false;
  isMenuOpen = false;
  cartItemsCount = 0;
  isScrolled = false;
  isSearchOpen = false;

  constructor(
    private _categoriesService: CategoriesService,
    private _cartService: CartService
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

    this._cartService.cartItemsCount$.subscribe((cartItemsCount: number) => {
      this.cartItemsCount = cartItemsCount;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.isScrolled = scrollTop > 100;
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  closeSearch() {
    this.isSearchOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}