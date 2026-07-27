import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';
  role = 'client';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {
    if (!this.name || !this.email || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.authService.register(data).subscribe({
      next: (res: any) => {
        alert('Registration successful!');
        this.redirectByRole(res.role);
      },
      error: (err) => {
        alert(err.error?.message || 'Registration failed');
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
