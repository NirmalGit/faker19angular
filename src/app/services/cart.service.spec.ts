import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../interfaces/product.interface';

describe('CartService', () => {
  let service: CartService;
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 10.99,
    description: 'Test Description',
    category: 'test',
    image: 'test.jpg',
    rating: {
      rate: 4.5,
      count: 10
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart', () => {
    service.addToCart(mockProduct);
    expect(service.getCart().length).toBe(1);
    expect(service.cartCount()).toBe(1);
    expect(service.cartTotal()).toBe(10.99);
  });

  it('should increase quantity when adding same product', () => {
    service.addToCart(mockProduct);
    service.addToCart(mockProduct);
    expect(service.getCart().length).toBe(1);
    expect(service.cartCount()).toBe(2);
    expect(service.cartTotal()).toBe(21.98);
  });

  it('should remove item from cart', () => {
    service.addToCart(mockProduct);
    service.removeFromCart(mockProduct.id);
    expect(service.getCart().length).toBe(0);
    expect(service.cartCount()).toBe(0);
    expect(service.cartTotal()).toBe(0);
  });

  it('should update quantity', () => {
    service.addToCart(mockProduct);
    service.updateQuantity(mockProduct.id, 3);
    expect(service.getCart()[0].quantity).toBe(3);
    expect(service.cartCount()).toBe(3);
    expect(service.cartTotal()).toBe(32.97);
  });

  it('should remove item when updating quantity to 0', () => {
    service.addToCart(mockProduct);
    service.updateQuantity(mockProduct.id, 0);
    expect(service.getCart().length).toBe(0);
    expect(service.cartCount()).toBe(0);
  });

  it('should clear cart', () => {
    service.addToCart(mockProduct);
    service.addToCart({ ...mockProduct, id: 2 });
    service.clearCart();
    expect(service.getCart().length).toBe(0);
    expect(service.cartCount()).toBe(0);
    expect(service.cartTotal()).toBe(0);
  });
});