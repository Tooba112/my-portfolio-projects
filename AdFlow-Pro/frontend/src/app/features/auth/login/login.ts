import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    const data = { email: this.email, password: this.password };

    this.authService.login(data).subscribe({
      next: (res: any) => {
        this.redirectByRole(res.role);
      },
      error: (err) => {
        alert(err.error?.message || 'Login failed');
      }
    });
  }

  private redirectByRole(role: string) {
    const routes: Record<string, string> = {
      client: '/client-dashboard',
      provider: '/provider',
      admin: '/admin',
      moderator: '/moderator'
    };
    this.router.navigate([routes[role] || '/login']);
  }
}
