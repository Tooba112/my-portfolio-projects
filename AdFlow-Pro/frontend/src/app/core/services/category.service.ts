import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) {}

  /** Returns only categories that have a non-empty name — never "undefined" in dropdowns */
  getCategories() {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((cats) => (cats || []).filter((c) => c && c.name && c.name.trim() !== ''))
    );
  }

  createCategory(name: string) {
    return this.http.post<any>(this.apiUrl, { name: name.trim() });
  }

  deleteCategory(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
