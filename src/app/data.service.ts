import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://localhost:7061/api';

  constructor(private http: HttpClient) { }

  login(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { id });
  }

  getMessages(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('UserId', userId!);  // Use non-null assertion operator

    return this.http.get<any[]>(`${this.apiUrl}/message`, { headers });
  }

  addMessage(text: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('UserId', userId!);  // Use non-null assertion operator
  
    const newMessage = { text: text, date: new Date().toISOString() };  // Ensure correct date format
    return this.http.post<any>(`${this.apiUrl}/message`, newMessage, { headers });
  }
  
}
