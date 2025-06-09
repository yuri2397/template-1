import { Component, OnInit, HostListener } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { filter } from 'rxjs/operators';

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
  cartItemsCount = 0;
  isScrolled = false;
  isSearchOpen = false;
  isHomePage = false;

  constructor(
    private _categoriesService: CategoriesService,
    private _cartService: CartService,
    private router: Router
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

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage = event.url === '/' || event.url === '';
    });

    this.isHomePage = this.router.url === '/' || this.router.url === '';
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