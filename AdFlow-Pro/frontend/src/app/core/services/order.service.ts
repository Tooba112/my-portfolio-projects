import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(gigId: string) {
    return this.http.post<any>(this.apiUrl, { gigId });
  }

  getMyOrders() {
    return this.http.get<any[]>(`${this.apiUrl}/my`);
  }

  getProviderOrders() {
    return this.http.get<any[]>(`${this.apiUrl}/provider`);
  }

  getAllOrders() {
    return this.http.get<any[]>(this.apiUrl);
  }

  completeOrder(id: string) {
    return this.http.put<any>(`${this.apiUrl}/${id}/complete`, {});
  }
}
