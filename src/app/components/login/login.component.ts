import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
  isLoggedIn = false;
  private authService = inject(AuthService);
  private router = inject(Router);

  // Google client ID - Replace with your actual client ID from Google Cloud Console
  // For development, you can use this test value
  private clientId = '528817068666-rft2h8m002ubb1otm4ibntblsh5innji.apps.googleusercontent.com';

  ngOnInit(): void {
    // Check if user is already logged in
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize Google Sign-In after view is initialized
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn(): void {
    // Wait for the Google API to be fully loaded
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Display the Google Sign-In button
      google.accounts.id.renderButton(
        document.getElementById("googleSignInButton")!,
        { 
          theme: "outline", 
          size: "large",
          text: "sign_in_with_google",
          shape: "rectangular",
          logo_alignment: "left"
        }
      );
    } else {
      // If Google API is not loaded yet, try again after a delay
      setTimeout(() => this.initializeGoogleSignIn(), 100);
    }
  }

  handleCredentialResponse(response: any): void {
    // Decode the JWT token to get user information
    const decodedToken = this.decodeJwtResponse(response.credential);
    
    // Create a user object from the decoded token
    const googleUser: User = {
      id: decodedToken.sub,
      name: decodedToken.name,
      email: decodedToken.email,
      photoUrl: decodedToken.picture,
      idToken: response.credential
    };
    
    // Login with the Google user
    this.authService.loginWithGoogle(googleUser);
  }

  // A simple function to decode JWT tokens
  private decodeJwtResponse(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
