import { Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  getCart = this.cartItems.asReadonly();
  
  cartCount = signal(0);
  cartTotal = signal(0);

  addToCart(product: Product) {
    const currentCart = this.cartItems();
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      this.cartItems.update(items => 
        items.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.cartItems.update(items => [...items, { ...product, quantity: 1 }]);
    }
    this.updateCartStats();
  }

  removeFromCart(productId: number) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
    this.updateCartStats();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    this.cartItems.update(items =>
      items.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
    this.updateCartStats();
  }

  clearCart() {
    this.cartItems.set([]);
    this.updateCartStats();
  }

  private updateCartStats() {
    const cart = this.cartItems();
    this.cartCount.set(cart.reduce((total, item) => total + item.quantity, 0));
    this.cartTotal.set(cart.reduce((total, item) => total + (item.price * item.quantity), 0));
  }
}