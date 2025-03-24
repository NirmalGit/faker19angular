import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';
import { AuthService, User } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: User | null = null;

  // Cart signals for display
  cartCount = this.cartService.cartCount;
  cartTotal = this.cartService.cartTotal;

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      // Redirect to login if not authenticated
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  toggleCart(): void {
    // We'll emit an event that the ProductsComponent can listen to
    this.cartService.toggleCart();
  }
}
