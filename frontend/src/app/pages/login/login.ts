import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  login(): void {
    this.authService.login();

    this.router.navigate(['/incidents']);
  }
}