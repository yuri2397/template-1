import { Routes } from '@angular/router';
import { detailsProductResolver } from './core/resolvers/details-product.resolver';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'catalog',
    loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'catalog/:id',
    resolve: {
      product: detailsProductResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () => import('./features/details-product/details-product.component').then(m => m.DetailsProductComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./shared/components/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
