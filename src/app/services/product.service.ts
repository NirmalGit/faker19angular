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
  private isLoadingSignal = signal(false);

  // Public readonly computed signals
  readonly products = computed(() => this.productsSignal());
  readonly categories = computed(() => this.categoriesSignal());
  readonly isLoading = computed(() => this.isLoadingSignal());

  constructor() {
    // Initialize data
    this.loadInitialData();
  }

  private async loadInitialData() {
    this.isLoadingSignal.set(true);
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
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  async filterByCategory(category: string) {
    this.selectedCategorySignal.set(category);
    this.isLoadingSignal.set(true);
    
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
    } finally {
      this.isLoadingSignal.set(false);
    }
  }
}