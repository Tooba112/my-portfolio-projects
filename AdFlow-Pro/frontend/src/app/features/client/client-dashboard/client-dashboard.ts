import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GigService } from '../../../core/services/gig.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
import { ReviewService } from '../../../core/services/review.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css'
})
export class ClientComponent implements OnInit {

  user: any = null;
  activeTab = 'gigs';

  // Gigs
  gigs: any[] = [];
  categories: any[] = [];
  selectedCategory = '';

  // Orders
  orders: any[] = [];

  // Payments
  payments: any[] = [];
  paymentForm = { orderId: '', amount: 0, paymentMethod: 'bank_transfer' };
  showPaymentForm = false;

  // Reviews
  reviewForm = { providerId: '', gigId: '', rating: 5, comment: '' };
  showReviewForm = false;

  constructor(
    private authService: AuthService,
    private gigService: GigService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private reviewService: ReviewService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadGigs();
    this.loadCategories();
    this.loadOrders();
    this.loadPayments();
  }

  loadGigs() {
    this.gigService.getGigs(this.selectedCategory || undefined).subscribe({
      next: (data) => this.gigs = data,
      error: (err) => console.error(err)
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  loadOrders() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error(err)
    });
  }

  loadPayments() {
    this.paymentService.getMyPayments().subscribe({
      next: (data) => this.payments = data,
      error: (err) => console.error(err)
    });
  }

  filterByCategory() {
    this.loadGigs();
  }

  placeOrder(gig: any) {
    if (!confirm(`Order "${gig.title}" for $${gig.price}?`)) return;

    this.orderService.createOrder(gig._id).subscribe({
      next: (order) => {
        alert('Order placed successfully!');
        this.loadOrders();
        this.activeTab = 'orders';
      },
      error: (err) => alert(err.error?.message || 'Failed to place order')
    });
  }

  openPaymentForm(order: any) {
    this.paymentForm = {
      orderId: order._id,
      amount: order.amount,
      paymentMethod: 'bank_transfer'
    };
    this.showPaymentForm = true;
  }

  submitPayment() {
    this.paymentService.createPayment(this.paymentForm).subscribe({
      next: () => {
        alert('Payment submitted! Awaiting admin verification.');
        this.showPaymentForm = false;
        this.loadPayments();
        this.activeTab = 'payments';
      },
      error: (err) => alert(err.error?.message || 'Payment failed')
    });
  }

  openReviewForm(order: any) {
    this.reviewForm = {
      providerId: order.provider?._id || order.provider,
      gigId: order.gig?._id || order.gig,
      rating: 5,
      comment: ''
    };
    this.showReviewForm = true;
  }

  submitReview() {
    this.reviewService.createReview(this.reviewForm).subscribe({
      next: () => {
        alert('Review submitted!');
        this.showReviewForm = false;
      },
      error: (err) => alert(err.error?.message || 'Review failed')
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
