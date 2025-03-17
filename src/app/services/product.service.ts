import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com';

  // Create writeable signals
  private productsSignal = signal<Product[]>([]);
  private categoriesSignal = signal<string[]>([]);
  private selectedCategorySignal = signal<string>('');

  // Public readonly computed signals
  readonly products = computed(() => this.productsSignal());
  readonly categories = computed(() => this.categoriesSignal());

  constructor() {
    // Initialize data
    this.loadInitialData();
  }

  private async loadInitialData() {
    try {
      // Load categories
      const categoriesResponse = await this.http.get<string[]>(`${this.apiUrl}/products/categories`).toPromise();
      if (categoriesResponse) {
        this.categoriesSignal.set(categoriesResponse);
      }

      // Load initial products
      const productsResponse = await this.http.get<Product[]>(`${this.apiUrl}/products`).toPromise();
      if (productsResponse) {
        this.productsSignal.set(productsResponse);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  async filterByCategory(category: string) {
    this.selectedCategorySignal.set(category);
    
    try {
      if (!category) {
        const allProducts = await this.http.get<Product[]>(`${this.apiUrl}/products`).toPromise();
        if (allProducts) {
          this.productsSignal.set(allProducts);
        }
      } else {
        const filteredProducts = await this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}`).toPromise();
        if (filteredProducts) {
          this.productsSignal.set(filteredProducts);
        }
      }
    } catch (error) {
      console.error('Error filtering products:', error);
      // In case of error, keep existing products
    }
  }
}