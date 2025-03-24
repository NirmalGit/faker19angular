import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  email: string;
  name: string;
  photoUrl: string;
  id: string;
  idToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Check if user info exists in local storage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  loginWithGoogle(user: User): void {
    // Store user details in local storage to keep user logged in
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.router.navigate(['/']);
  }

  logout(): void {
    // Remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}