import { CommonModule } from "@angular/common";
import { Product } from "../../shared/components/product-item/product-item.component";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Component, ViewChild } from "@angular/core";
import { OnInit } from "@angular/core";
import { NgImageSliderComponent, NgImageSliderModule } from "ng-image-slider";
import { ProductsService } from "../../core/services/products.service";
@Component({
  selector: 'app-details-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgImageSliderModule
  ],
  templateUrl: './details-product.component.html',
  styleUrl: './details-product.component.scss'
})
export class DetailsProductComponent implements OnInit {
  @ViewChild('nav') slider!: NgImageSliderComponent;
  imageObject: any[] = [];

  product!: Product;
  products: Product[] = [];
  relatedProducts: Product[] = [];
  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    this.product = this.route.snapshot.data['product']?.data;
    this.imageObject = this.product.images.map(image => ({
      image: image.url,
      thumbImage: image.url,
    }));
    this.getRelatedProducts(this.product.id);
  }

  getRelatedProducts(productId: string) {
      this.productService
    .getRelatedProducts(productId, {
      limit: 2,
      with_images: 1
    })
    .subscribe(products => {
      this.relatedProducts = [...products.data];
    });
  }


  showImage(index: number) {
      // this.slider.showImage(index);
  }

}
