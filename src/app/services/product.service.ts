import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { lastValueFrom } from 'rxjs';

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
    // Load categories in constructor
    this.loadCategories();
    // Also load products initially
    this.fetchAllProducts();
  }

  private async loadCategories() {
    try {
      const categoriesResponse = await lastValueFrom(this.http.get<string[]>(`${this.apiUrl}/products/categories`));
      this.categoriesSignal.set(categoriesResponse);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  // Public method to load products - renamed to be more explicit
  async fetchAllProducts() {
    this.isLoadingSignal.set(true);
    try {
      const productsResponse = await lastValueFrom(this.http.get<Product[]>(`${this.apiUrl}/products`));
      this.productsSignal.set(productsResponse);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  async filterByCategory(category: string) {
    this.selectedCategorySignal.set(category);
    this.isLoadingSignal.set(true);
    
    try {
      if (!category) {
        await this.fetchAllProducts();
      } else {
        const filteredProducts = await lastValueFrom(
          this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}`)
        );
        this.productsSignal.set(filteredProducts);
      }
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      this.isLoadingSignal.set(false);
    }
  }
}