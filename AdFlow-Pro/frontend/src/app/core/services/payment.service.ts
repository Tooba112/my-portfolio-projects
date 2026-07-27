import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'http://localhost:5000/api/payments';

  constructor(private http: HttpClient) {}

  createPayment(data: { orderId: string; amount: number; paymentMethod: string }) {
    return this.http.post<any>(this.apiUrl, data);
  }

  getMyPayments() {
    return this.http.get<any[]>(`${this.apiUrl}/my`);
  }

  getAllPayments() {
    return this.http.get<any[]>(this.apiUrl);
  }

  verifyPayment(id: string) {
    return this.http.put<any>(`${this.apiUrl}/${id}/verify`, {});
  }
}
