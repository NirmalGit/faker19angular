import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../interfaces/product.interface';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://fakestoreapi.com';

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Test Product 1',
      price: 10.99,
      description: 'Test Description 1',
      category: 'electronics',
      image: 'test1.jpg',
      rating: { rate: 4.5, count: 10 }
    },
    {
      id: 2,
      title: 'Test Product 2',
      price: 20.99,
      description: 'Test Description 2',
      category: 'clothing',
      image: 'test2.jpg',
      rating: { rate: 4.0, count: 20 }
    }
  ];

  const mockCategories = ['electronics', 'clothing'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial data', () => {
    // Mock the categories request
    const categoriesReq = httpMock.expectOne(`${apiUrl}/products/categories`);
    expect(categoriesReq.request.method).toBe('GET');
    categoriesReq.flush(mockCategories);

    // Mock the products request
    const productsReq = httpMock.expectOne(`${apiUrl}/products`);
    expect(productsReq.request.method).toBe('GET');
    productsReq.flush(mockProducts);

    expect(service.categories()).toEqual(mockCategories);
    expect(service.products()).toEqual(mockProducts);
  });

  it('should filter products by category', async () => {
    const category = 'electronics';
    const filteredProducts = mockProducts.filter(p => p.category === category);

    await service.filterByCategory(category);

    const req = httpMock.expectOne(`${apiUrl}/products/category/${category}`);
    expect(req.request.method).toBe('GET');
    req.flush(filteredProducts);

    expect(service.products()).toEqual(filteredProducts);
  });

  it('should load all products when filter category is empty', async () => {
    await service.filterByCategory('');

    const req = httpMock.expectOne(`${apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);

    expect(service.products()).toEqual(mockProducts);
  });

  it('should handle error when loading products', async () => {
    const errorMessage = 'Network error';
    await service.filterByCategory('electronics');

    const req = httpMock.expectOne(`${apiUrl}/products/category/electronics`);
    req.error(new ErrorEvent('Network error', {
      message: errorMessage
    }));

    // Products should remain unchanged
    expect(service.products()).toEqual([]);
    expect(service.isLoading()).toBeFalsy();
  });

  it('should set loading state correctly', async () => {
    const loadingStates: boolean[] = [];
    service.isLoading.subscribe((state) => loadingStates.push(state));

    const promise = service.filterByCategory('electronics');
    expect(service.isLoading()).toBeTruthy();

    const req = httpMock.expectOne(`${apiUrl}/products/category/electronics`);
    req.flush(mockProducts);
    await promise;

    expect(service.isLoading()).toBeFalsy();
  });
});