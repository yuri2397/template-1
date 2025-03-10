import { Component } from '@angular/core';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { HomeCategoriesComponent } from './components/home-categories/home-categories.component';
import { HomeProductFeatureComponent } from './components/home-product-feature/home-product-feature.component';
import { HomeBestSaleComponent } from './components/home-best-sale/home-best-sale.component';
  @Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeHeroComponent,
    HomeCategoriesComponent,
    HomeProductFeatureComponent,
    HomeBestSaleComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
