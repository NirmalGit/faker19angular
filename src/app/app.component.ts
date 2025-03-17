import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Product } from './interfaces/product.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  categories = this.productService.categories;
  products = this.productService.products;
  selectedCategory = '';
  showCart = false;

  // Cart signals
  cart = this.cartService.getCart;
  cartCount = this.cartService.cartCount;
  cartTotal = this.cartService.cartTotal;

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
