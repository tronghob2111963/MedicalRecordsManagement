import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../enviroments/enviroment';
import { LoginDTO } from '../dtos/auth/login.dto';

export interface TokenResponse {
  accessToken: string;  // Khớp với BE
  refreshToken: string; // Khớp với BE
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private get apiConfig() {
    return {
      headers: this.createHeaders(),
      withCredentials: true,
    };
  }

  login(loginData: LoginDTO): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/access-token`, loginData, this.apiConfig).pipe(
      tap(response => {
        console.log('API Response:', response); // Debug phản hồi từ API
        if (!response || !response.accessToken || response.accessToken === 'undefined') {
          console.error('Invalid response:', response);
          throw new Error('Invalid or missing AccessToken in response');
        }
        this.saveTokens(response, response.username);
      }),
      catchError(error => {
        console.error('Login error details:', error);
        let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại sau.';
        if (error.status === 401 || error.status === 403) {
          errorMessage = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
        } else if (error.status === 0) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  saveTokens(tokenResponse: TokenResponse, username: string): void {
    if (!tokenResponse.accessToken || !tokenResponse.refreshToken) {
      console.error('Cannot save tokens: AccessToken or RefreshToken is missing', tokenResponse);
      throw new Error('Missing tokens');
    }
    if (tokenResponse.accessToken.split('.').length !== 3) {
      console.error('Invalid JWT format for AccessToken:', tokenResponse.accessToken);
      throw new Error('Invalid AccessToken format');
    }
    localStorage.setItem('accessToken', tokenResponse.accessToken);
    localStorage.setItem('refreshToken', tokenResponse.refreshToken);
    localStorage.setItem('role', tokenResponse.role);
    localStorage.setItem('username', username);
    console.log('Tokens saved successfully:', {
      accessToken: tokenResponse.accessToken.substring(0, 20) + '...',
      refreshToken: tokenResponse.refreshToken.substring(0, 20) + '...',
      role: tokenResponse.role,
      username: username
    });
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    console.log('User logged out, localStorage cleared');
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    const isValid = !!token && token !== 'undefined' && token.split('.').length === 3;
    console.log('isLoggedIn check:', isValid);
    return isValid;
  }
}

// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { LoginDTO } from '../dtos/auth/login.dto';
// import { Observable } from 'rxjs';
// import { environment } from '../enviroments/enviroment';

// // Interface cho response từ backend
// export interface TokenResponse {
//   AccessToken: string;
//   RefreshToken: string;
//   username: string;
//   role: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = `${environment.apiUrl}/auth`;

//   constructor(private http: HttpClient) { }

//   private apiConfig = {
//     headers: this.createHeaders(),
//     withCredentials: true,
//   }

//   private createHeaders(): HttpHeaders {
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//     });
//   }

//   login(loginData: LoginDTO): Observable<TokenResponse> {
//     return this.http.post<TokenResponse>(`${this.apiUrl}/access-token`, loginData, this.apiConfig);
//   }

//   // Phương thức để lưu token vào localStorage
//   saveTokens(tokenResponse: TokenResponse, username: string): void {
//     localStorage.setItem('accessToken', tokenResponse.AccessToken);
//     localStorage.setItem('refreshToken', tokenResponse.RefreshToken);
//     localStorage.setItem('role', tokenResponse.role);
//     localStorage.setItem('username', username);
//   }

//   // Phương thức để lấy access token
//   getAccessToken(): string | null {
//     return localStorage.getItem('accessToken');
//   }

//   // Phương thức để lấy user role
//   getUserRole(): string | null {
//     return localStorage.getItem('role');
//   }

//   getUsername(): string | null {
//     return localStorage.getItem('username');
//   }

//   // Phương thức để logout
//   logout(): void {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('userRole');
//   }

//   // Phương thức để kiểm tra xem user đã đăng nhập chưa
//   isLoggedIn(): boolean {
//     return !!this.getAccessToken();
//   }
// }