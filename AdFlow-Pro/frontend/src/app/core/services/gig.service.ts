import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GigService {
  private apiUrl = 'http://localhost:5000/api/gigs';

  constructor(private http: HttpClient) {}

  getGigs(category?: string) {
    const url = category ? `${this.apiUrl}?category=${category}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  getGigById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getMyGigs() {
    return this.http.get<any[]>(`${this.apiUrl}/provider/my`);
  }

  getPendingGigs() {
    return this.http.get<any[]>(`${this.apiUrl}/moderation/pending`);
  }

  createGig(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  approveGig(id: string) {
    return this.http.put<any>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectGig(id: string) {
    return this.http.put<any>(`${this.apiUrl}/${id}/reject`, {});
  }

  deleteGig(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
