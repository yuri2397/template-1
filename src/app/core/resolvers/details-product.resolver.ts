import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Product } from '../../shared/components/product-item/product-item.component';
import { ProductsService } from '../services/products.service';

export const detailsProductResolver: ResolveFn<Product> = (route, state) => {
  const productService = inject(ProductsService);
  const productId = route.params['id'];
  return productService.getProductDetails(productId, {
    with_images: true,
    with_related: true
  });
};
