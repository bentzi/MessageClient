import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as crypto from 'crypto-js';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;  

  constructor(private http: HttpClient) { }

  login(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}`);
  }

  getMessages(): Observable<any[]> {
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders()
      .set('UserId', userId!);

    return this.http.get<any[]>(`${this.apiUrl}/message`, { headers });
  }

  getClientSecretKey(userId: string): string | undefined {
    if (userId in environment.secretKeys) {
      return environment.secretKeys[userId];
    }
    return undefined;
  }

  generateHmacSignature(message: string, userId: string, timestamp: number): string {
    const secretKey = this.getClientSecretKey(userId)!;
    const data = `${message}|${userId}|${timestamp}`;
    return crypto.HmacSHA256(data, secretKey).toString(crypto.enc.Hex);
  }

  addMessage(text: string): Observable<any> {
    const userId = localStorage.getItem('userId');
    const timestamp = Date.now();  
    const hmacSignature = this.generateHmacSignature(text, userId!, timestamp);
    const headers = new HttpHeaders()
      .set('UserId', userId!)
      .set('Signature', hmacSignature);

    const newMessage = { text: text, timestamp: timestamp };
    return this.http.post<any>(`${this.apiUrl}/message`, newMessage, { headers });
  }
}
