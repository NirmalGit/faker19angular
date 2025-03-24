import { Component, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cartToggleSubscription?: Subscription;

  categories = this.productService.categories;
  products = this.productService.products;
  isLoading = this.productService.isLoading;
  selectedCategory = '';
  showCart = false;

  // Cart signals
  cart = this.cartService.getCart;
  cartCount = this.cartService.cartCount;
  cartTotal = this.cartService.cartTotal;

  ngOnInit() {
    // Load initial products
    this.productService.fetchAllProducts();
    
    // Subscribe to cart toggle events
    this.cartToggleSubscription = this.cartService.cartToggle.subscribe(() => {
      this.showCart = !this.showCart;
    });
  }

  ngOnDestroy() {
    // Clean up subscriptions
    if (this.cartToggleSubscription) {
      this.cartToggleSubscription.unsubscribe();
    }
  }

  async filterByCategory(category: string) {
    this.selectedCategory = category;
    await this.productService.filterByCategory(category);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  checkout() {
    alert('Thank you for your purchase! Total: $' + this.cartTotal().toFixed(2));
    this.cartService.clearCart();
    this.showCart = false;
  }
}