import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GigService } from '../../../core/services/gig.service';

@Component({
  selector: 'app-moderator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moderator-dashboard.html',
  styleUrl: './moderator-dashboard.css'
})
export class ModeratorComponent implements OnInit {

  user: any = null;
  pendingGigs: any[] = [];
  approvedCount = 0;
  rejectedCount = 0;

  constructor(
    private authService: AuthService,
    private gigService: GigService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadPendingGigs();
  }

  loadPendingGigs() {
    this.gigService.getPendingGigs().subscribe({
      next: (data) => this.pendingGigs = data,
      error: (err) => console.error(err)
    });
  }

  approveGig(id: string) {
    this.gigService.approveGig(id).subscribe({
      next: () => {
        alert('Gig approved!');
        this.approvedCount++;
        this.loadPendingGigs();
      },
      error: (err) => alert(err.error?.message || 'Failed to approve')
    });
  }

  rejectGig(id: string) {
    this.gigService.rejectGig(id).subscribe({
      next: () => {
        alert('Gig rejected.');
        this.rejectedCount++;
        this.loadPendingGigs();
      },
      error: (err) => alert(err.error?.message || 'Failed to reject')
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
