import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { PaymentService } from '../../../core/services/payment.service';
import { OrderService } from '../../../core/services/order.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminComponent implements OnInit {

  user: any = null;
  activeTab = 'users';

  // Users
  users: any[] = [];

  // Payments
  payments: any[] = [];

  // Orders
  orders: any[] = [];

  // Categories
  categories: any[] = [];
  newCategoryName = '';

  // Analytics
  totalUsers = 0;
  totalOrders = 0;
  totalPayments = 0;
  verifiedPayments = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadUsers();
    this.loadPayments();
    this.loadOrders();
    this.loadCategories();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.totalUsers = data.length;
      },
      error: (err) => console.error(err)
    });
  }

  loadPayments() {
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.totalPayments = data.length;
        this.verifiedPayments = data.filter((p: any) => p.status === 'verified').length;
      },
      error: (err) => console.error(err)
    });
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.totalOrders = data.length;
      },
      error: (err) => console.error(err)
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  updateRole(userId: string, role: string) {
    this.userService.updateUserRole(userId, role).subscribe({
      next: () => {
        alert('Role updated!');
        this.loadUsers();
      },
      error: (err) => alert(err.error?.message || 'Failed to update role')
    });
  }

  deleteUser(id: string) {
    if (!confirm('Delete this user?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        alert('User deleted');
        this.loadUsers();
      },
      error: (err) => alert(err.error?.message || 'Failed to delete user')
    });
  }

  verifyPayment(id: string) {
    this.paymentService.verifyPayment(id).subscribe({
      next: () => {
        alert('Payment verified!');
        this.loadPayments();
        this.loadOrders();
      },
      error: (err) => alert(err.error?.message || 'Failed to verify payment')
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim()) {
      alert('Enter a category name');
      return;
    }
    this.categoryService.createCategory(this.newCategoryName.trim()).subscribe({
      next: () => {
        alert('Category added!');
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: (err) => alert(err.error?.message || 'Failed to add category')
    });
  }

  deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        alert('Category deleted');
        this.loadCategories();
      },
      error: (err) => alert(err.error?.message || 'Failed to delete category')
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
