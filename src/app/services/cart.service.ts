import { Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { Subject } from 'rxjs';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = signal<CartItem[]>([]);
  cartToggle = new Subject<void>();

  constructor() {
    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cart.set(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
      }
    }
  }

  // Cart state accessors
  get getCart() {
    return this.cart;
  }

  get cartCount() {
    return () => this.cart().reduce((count, item) => count + item.quantity, 0);
  }

  get cartTotal() {
    return () => this.cart().reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Cart actions
  addToCart(product: Product) {
    const currentCart = this.cart();
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      // Update quantity if item already exists
      const updatedCart = currentCart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      this.cart.set(updatedCart);
    } else {
      // Add new item
      this.cart.set([...currentCart, { ...product, quantity: 1 }]);
    }

    this.saveCart();
  }

  removeFromCart(productId: number) {
    const updatedCart = this.cart().filter(item => item.id !== productId);
    this.cart.set(updatedCart);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      this.removeFromCart(productId);
      return;
    }

    const updatedCart = this.cart().map(item => 
      item.id === productId 
        ? { ...item, quantity } 
        : item
    );
    this.cart.set(updatedCart);
    this.saveCart();
  }

  clearCart() {
    this.cart.set([]);
    this.saveCart();
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  toggleCart() {
    this.cartToggle.next();
  }
}