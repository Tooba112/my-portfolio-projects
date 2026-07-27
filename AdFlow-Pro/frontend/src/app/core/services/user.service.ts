import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProfile() {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }

  updateUserRole(id: string, role: string) {
    return this.http.put<any>(`${this.apiUrl}/${id}/role`, { role });
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
