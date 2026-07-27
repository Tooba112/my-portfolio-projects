import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = 'http://localhost:5000/api/reviews';

  constructor(private http: HttpClient) {}

  createReview(data: { providerId: string; gigId?: string; rating: number; comment: string }) {
    return this.http.post<any>(this.apiUrl, data);
  }

  getAllReviews() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProviderReviews(providerId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/provider/${providerId}`);
  }
}
