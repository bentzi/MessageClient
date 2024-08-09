import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as crypto from 'crypto-js';

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

  getClientSecretKey(userId: string): string | undefined {
    if (userId === '1234') return '1234SecretKey';
    if (userId === '5678') return '5678SecretKey'; 
    return undefined; // Explicitly return undefined if userId doesn't match
  }

  generateHmacSignature(message: string, userId: string): string {
    const secretKey = this.getClientSecretKey(userId); // This should be securely stored and should match the server's key
    const data = `${message}|${userId}|${Date.now()}`; // Include timestamp
    return crypto.HmacSHA256(data, secretKey as string).toString(crypto.enc.Hex);
  }

  addMessage(text: string): Observable<any> {
    const userId = localStorage.getItem('userId');
    const hmacSignature = this.generateHmacSignature(text, userId!);
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      .set('UserId', userId!)
      .set('Signature', hmacSignature); // Include the signature header
  
    const newMessage = { text: text, timestamp: Date.now() };
    return this.http.post<any>(`${this.apiUrl}/message`, newMessage, { headers });
  }
  
}
