import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { signal } from '@angular/core';
import { Product } from './interfaces/product.interface';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 10.99,
    description: 'Test Description',
    category: 'test',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 10 }
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['filterByCategory'], {
      categories: signal(['test', 'test2']),
      products: signal([mockProduct]),
      isLoading: signal(false)
    });

    const cartServiceSpy = jasmine.createSpyObj('CartService', 
      ['addToCart', 'removeFromCart', 'updateQuantity', 'clearCart'],
      {
        getCart: signal([]),
        cartCount: signal(0),
        cartTotal: signal(0)
      }
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render store name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('FakeStore');
  });

  it('should filter products by category', async () => {
    productService.filterByCategory.and.returnValue(Promise.resolve());
    await component.filterByCategory('test');
    expect(component.selectedCategory).toBe('test');
    expect(productService.filterByCategory).toHaveBeenCalledWith('test');
  });

  it('should add product to cart', () => {
    component.addToCart(mockProduct);
    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should remove product from cart', () => {
    component.removeFromCart(1);
    expect(cartService.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should update product quantity', () => {
    component.updateQuantity(1, 2);
    expect(cartService.updateQuantity).toHaveBeenCalledWith(1, 2);
  });

  it('should handle checkout', () => {
    spyOn(window, 'alert');
    component.checkout();
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(component.showCart).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  });
});
