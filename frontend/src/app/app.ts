import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterOutlet
} from '@angular/router';

import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private authService = inject(Auth);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}