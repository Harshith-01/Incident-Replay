import { Service,inject ,signal} from '@angular/core';

@Service()
export class Auth {
  private authenticated =
    signal(false);

  isAuthenticated(): boolean {
    return this.authenticated();
  }

  login(): void {
    this.authenticated.set(true);
  }

  logout(): void {
    this.authenticated.set(false);
  }
}
