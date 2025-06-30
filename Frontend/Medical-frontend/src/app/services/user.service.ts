import { Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserResponseDTO {
  id: number;
  username: string;
  doctor_id?: number;
  role: string;
}

// Interface cho User Creation Request
export interface UserCreationRequest {
  username: string;
  password: string;
  doctorId?: number;
  role: string;
}

// Interface cho User Entity (từ backend)
export interface User {
  id: number;
  username: string;
  password?: string;
  doctor_id?: number;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageResponse<T> {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  items: T[];
}

// Interface cho Response Data
export interface ResponseData<T> {
  status: number;
  message: string;
  data: T;
}

export interface ResponseError {
  status: number;
  message: string;
}

// Interface cho Create User Response (từ controller)
export interface CreateUserResponse {
  status: number;
  message: string;
  data: UserResponseDTO;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  private minTokenLength = 13;

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private get apiConfig() {
    return {
      headers: this.createHeaders(),
      withCredentials: true,
    };
  }

  /**
   * Tạo user mới
   * POST /user/create
   */
  createUser(request: UserCreationRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(
      `${this.apiUrl}/create`,
      request,
      this.apiConfig
    );
  }

  /**
   * Lấy tất cả users với phân trang
   * GET /user/get-all-users
   * Yêu cầu quyền ROLE_ADMIN
   */
  getAllUsers(pageNo: number = 1, pageSize: number = 10, sortBy: string = 'ID:asc'): Observable<ResponseData<PageResponse<UserResponseDTO>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy);

    return this.http.get<ResponseData<PageResponse<UserResponseDTO>>>(
      `${this.apiUrl}/get-all-users`,
      {
        ...this.apiConfig,
        params
      }
    );
  }

  /**
   * Cập nhật user theo ID
   * PUT /user/update/{id}
   * Yêu cầu quyền ROLE_ADMIN
   */
  updateUser(id: number, request: UserCreationRequest): Observable<ResponseData<UserResponseDTO>> {
    return this.http.put<ResponseData<UserResponseDTO>>(
      `${this.apiUrl}/update/${id}`,
      request,
      this.apiConfig
    );
  }

  /**
   * Lấy user theo ID
   * GET /user/get-user/{id}
   * Yêu cầu quyền ROLE_ADMIN
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/get-user/${id}`,
      this.apiConfig
    );
  }

  deleteUser(id: number): Observable<ResponseError> {
    return this.http.delete<ResponseError>(
      `${this.apiUrl}/delete/${id}`,
      this.apiConfig
    );
  }

  // Các phương thức tiện ích bổ sung

  /**
   * Kiểm tra token có hợp lệ không
   */
  isTokenValid(): boolean {
    const token = localStorage.getItem('accessToken');
    return token !== null && token.length >= this.minTokenLength;
  }

  /**
   * Xóa token khỏi localStorage
   */
  clearToken(): void {
    localStorage.removeItem('accessToken');
  }

  /**
   * Lưu token vào localStorage
   */
  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  /**
   * Lấy danh sách users với các tùy chọn sắp xếp phổ biến
   */
  getUsersSortedByUsername(pageNo: number = 1, pageSize: number = 10, ascending: boolean = true): Observable<ResponseData<PageResponse<UserResponseDTO>>> {
    const sortBy = ascending ? 'username:asc' : 'username:desc';
    return this.getAllUsers(pageNo, pageSize, sortBy);
  }

  /**
   * Lấy danh sách users sắp xếp theo ID
   */
  getUsersSortedById(pageNo: number = 1, pageSize: number = 10, ascending: boolean = true): Observable<ResponseData<PageResponse<UserResponseDTO>>> {
    const sortBy = ascending ? 'ID:asc' : 'ID:desc';
    return this.getAllUsers(pageNo, pageSize, sortBy);
  }

  /**
   * Lấy danh sách users sắp xếp theo role
   */
  getUsersSortedByRole(pageNo: number = 1, pageSize: number = 10, ascending: boolean = true): Observable<ResponseData<PageResponse<UserResponseDTO>>> {
    const sortBy = ascending ? 'role:asc' : 'role:desc';
    return this.getAllUsers(pageNo, pageSize, sortBy);
  }
}
