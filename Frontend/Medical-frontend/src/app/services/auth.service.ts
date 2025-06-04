import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDTO } from '../dtos/auth/login.dto';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';

// Interface cho response từ backend
export interface TokenResponse {
  AccessToken: string;
  RefreshToken: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  private apiConfig = {
    headers: this.createHeaders(),
    withCredentials: true,
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  login(loginData: LoginDTO): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/access-token`, loginData, this.apiConfig);
  }

  // Phương thức để lưu token vào localStorage
  saveTokens(tokenResponse: TokenResponse): void {
    localStorage.setItem('accessToken', tokenResponse.AccessToken);
    localStorage.setItem('refreshToken', tokenResponse.RefreshToken);
    localStorage.setItem('userRole', tokenResponse.role);
  }

  // Phương thức để lấy access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Phương thức để lấy user role
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Phương thức để logout
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
  }

  // Phương thức để kiểm tra xem user đã đăng nhập chưa
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}