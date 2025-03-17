import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com';

  products = toSignal(
    this.http.get<Product[]>(`${this.apiUrl}/products`),
    { initialValue: [] }
  );

  getProduct(id: number) {
    return toSignal(
      this.http.get<Product>(`${this.apiUrl}/products/${id}`)
    );
  }

  getCategories = toSignal(
    this.http.get<string[]>(`${this.apiUrl}/products/categories`),
    { initialValue: [] }
  );

  getProductsByCategory(category: string) {
    return toSignal(
      this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}`),
      { initialValue: [] }
    );
  }
}