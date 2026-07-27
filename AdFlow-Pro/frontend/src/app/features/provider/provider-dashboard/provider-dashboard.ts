import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GigService } from '../../../core/services/gig.service';
import { OrderService } from '../../../core/services/order.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-provider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-dashboard.html',
  styleUrl: './provider-dashboard.css'
})
export class ProviderComponent implements OnInit {

  user: any = null;
  activeTab = 'gigs';

  // Gigs
  myGigs: any[] = [];
  categories: any[] = [];
  gigForm = { title: '', description: '', price: 0, category: '' };
  showGigForm = false;

  // Orders
  providerOrders: any[] = [];

  // Analytics
  totalGigs = 0;
  totalOrders = 0;
  completedOrders = 0;
  totalEarnings = 0;

  constructor(
    private authService: AuthService,
    private gigService: GigService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadMyGigs();
    this.loadCategories();
    this.loadProviderOrders();
  }

  loadMyGigs() {
    this.gigService.getMyGigs().subscribe({
      next: (data) => {
        this.myGigs = data;
        this.totalGigs = data.length;
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

  loadProviderOrders() {
    this.orderService.getProviderOrders().subscribe({
      next: (data) => {
        this.providerOrders = data;
        this.totalOrders = data.length;
        this.completedOrders = data.filter((o: any) => o.status === 'completed').length;
        this.totalEarnings = data
          .filter((o: any) => o.status === 'completed')
          .reduce((sum: number, o: any) => sum + (o.amount || 0), 0);
      },
      error: (err) => console.error(err)
    });
  }

  createGig() {
    const { title, description, price, category } = this.gigForm;
    if (!title || !description || !price || !category) {
      alert('Please fill in all fields');
      return;
    }

    this.gigService.createGig(this.gigForm).subscribe({
      next: () => {
        alert('Gig submitted for moderation!');
        this.showGigForm = false;
        this.gigForm = { title: '', description: '', price: 0, category: '' };
        this.loadMyGigs();
      },
      error: (err) => alert(err.error?.message || 'Failed to create gig')
    });
  }

  deleteGig(id: string) {
    if (!confirm('Delete this gig?')) return;
    this.gigService.deleteGig(id).subscribe({
      next: () => {
        alert('Gig deleted');
        this.loadMyGigs();
      },
      error: (err) => alert(err.error?.message || 'Failed to delete gig')
    });
  }

  markComplete(orderId: string) {
    this.orderService.completeOrder(orderId).subscribe({
      next: () => {
        alert('Order marked as completed!');
        this.loadProviderOrders();
      },
      error: (err) => alert(err.error?.message || 'Failed to update order')
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
