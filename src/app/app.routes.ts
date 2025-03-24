import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'products', 
    component: ProductsComponent,
    canActivate: [authGuard] // Protected by auth guard
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products' } // Catch all route
];
