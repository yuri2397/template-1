import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ProductsService } from "../../core/services/products.service";
import { CartService } from "../../core/services/cart.service";
import { Product, ProductItemComponent } from "../../shared/components/product-item/product-item.component";

@Component({
  selector: 'app-details-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProductItemComponent
  ],
  templateUrl: './details-product.component.html',
  styleUrl: './details-product.component.scss'
})
export class DetailsProductComponent implements OnInit {
  product!: Product;
  relatedProducts: Product[] = [];
  currentImageIndex = 0;
  selectedQuantity = 1;
  isAddingToCart = false;
  isDescriptionExpanded = false;
  isImageModalOpen = false;
  favorites: Set<string> = new Set();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.product = this.route.snapshot.data['product']?.data;

    if (this.product) {
      this.loadFavorites();
      this.getRelatedProducts(this.product.id);

      // Scroll to top
      window.scrollTo(0, 0);
    }
  }

  getCurrentImage(): string {
    if (this.product?.images && this.product.images.length > 0) {
      return this.product.images[this.currentImageIndex]?.url || this.product.thumbnail_url;
    }
    return this.product?.thumbnail_url || 'assets/images/placeholder.jpg';
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage(): void {
    if (this.product.images && this.currentImageIndex < this.product.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  openImageModal(): void {
    this.isImageModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  isNewProduct(): boolean {
    if (!this.product?.created_at) return false;
    const createdDate = new Date(this.product.created_at);
    const daysDiff = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30;
  }

  hasRating(): boolean {
    return !!(this.product?.rating && this.product.rating > 0);
  }

  getRating(): number {
    return this.product?.rating || 0;
  }

  getReviewsCount(): number {
    return this.product?.reviews_count || 0;
  }

  getSavings(): number {
    if (!this.product) return 0;
    const price = parseFloat(this.product.price);
    const salePrice = parseFloat(this.product.sale_price);
    return price - salePrice;
  }

  isDescriptionLong(): boolean {
    return this.product?.description ? this.product.description.length > 300 : false;
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  hasFeatures(): boolean {
    // Always show features section for now
    return true;
  }

  incrementQuantity(): void {
    if (this.selectedQuantity < this.product.stock_quantity) {
      this.selectedQuantity++;
    }
  }

  decrementQuantity(): void {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  validateQuantity(): void {
    if (this.selectedQuantity < 1) {
      this.selectedQuantity = 1;
    } else if (this.selectedQuantity > this.product.stock_quantity) {
      this.selectedQuantity = this.product.stock_quantity;
    }
  }

  addToCart(): void {
    if (!this.product.in_stock || this.isAddingToCart) return;

    this.isAddingToCart = true;

    this.cartService.addToCart(this.product.id, this.selectedQuantity, false, this.product)
      .subscribe({
        next: () => {
          this.showMessage(`${this.product.name} ajouté au panier (${this.selectedQuantity})`, 'success');
          this.isAddingToCart = false;
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          this.showMessage('Erreur lors de l\'ajout au panier', 'error');
          this.isAddingToCart = false;
        }
      });
  }

  loadFavorites(): void {
    try {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        this.favorites = new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  saveFavorites(): void {
    try {
      localStorage.setItem('favorites', JSON.stringify([...this.favorites]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  isFavorite(): boolean {
    return this.favorites.has(this.product?.id);
  }

  toggleFavorite(): void {
    if (!this.product) return;

    if (this.favorites.has(this.product.id)) {
      this.favorites.delete(this.product.id);
      this.showMessage(`${this.product.name} retiré des favoris`, 'info');
    } else {
      this.favorites.add(this.product.id);
      this.showMessage(`${this.product.name} ajouté aux favoris`, 'success');
    }
    this.saveFavorites();
  }

  shareProduct(): void {
    if (!this.product) return;

    if (navigator.share) {
      navigator.share({
        title: this.product.name,
        text: this.product.description,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
        this.fallbackShare();
      });
    } else {
      this.fallbackShare();
    }
  }

  private fallbackShare(): void {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.showMessage('Lien copié dans le presse-papiers', 'success');
    }).catch(() => {
      this.showMessage('Impossible de copier le lien', 'error');
    });
  }

  getRelatedProducts(productId: string): void {
    this.productService
      .getRelatedProducts(productId, {
        limit: 4,
        with_images: 1
      })
      .subscribe({
        next: (response) => {
          this.relatedProducts = response?.data || [];
        },
        error: (error) => {
          console.error('Error loading related products:', error);
        }
      });
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.createToast(message, type);
  }

  private createToast(message: string, type: string): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const colors = {
      success: '#28a745',
      error: '#dc3545',
      info: '#17a2b8',
      warning: '#ffc107'
    };

    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type as keyof typeof colors] || colors.info};
      color: ${type === 'warning' ? '#212529' : 'white'};
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
      font-size: 0.9rem;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Suppression automatique
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }
}
