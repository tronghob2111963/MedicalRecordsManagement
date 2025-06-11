import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';

export interface DoctorRequestDTO {
  full_name: string;
  specialty: string;
  phone_number: string;
  email: string;
  license_Number: string;
  status: string;
}

export interface DoctorResponseDTO {
  id?: number;
  full_name: string;
  specialty: string;
  phone_number: string;
  email: string;
  license_Number: string; // Matching backend field name
  status: string;
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

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`; // Fixed URL to match backend endpoint

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
   * Get all doctors with pagination and sorting
   */
  getAllDoctors(
    pageNo: number = 1,
    pageSize: number = 10,
    sortBy: string = 'id:asc'
  ): Observable<ResponseData<PageResponse<DoctorResponseDTO>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy);

    return this.http.get<ResponseData<PageResponse<DoctorResponseDTO>>>(
      `${this.apiUrl}/all-doctors`,
      {
        ...this.apiConfig,
        params
      }
    );
  }

  /**
   * Get doctor by ID
   */
  getDoctorById(id: number): Observable<ResponseData<DoctorResponseDTO>> {
    const params = new HttpParams().set('id', id.toString());

    return this.http.get<ResponseData<DoctorResponseDTO>>(
      `${this.apiUrl}/doctor/${id}`,
      {
        ...this.apiConfig,
        params
      }
    );
  }

  /**
   * Create a new doctor
   */
  createDoctor(doctorData: DoctorRequestDTO): Observable<ResponseData<DoctorResponseDTO>> {
    return this.http.post<ResponseData<DoctorResponseDTO>>(
      `${this.apiUrl}/create-doctor`,
      doctorData,
      this.apiConfig
    );
  }

  /**
   * Update an existing doctor
   */
  updateDoctor(id: number, doctorData: DoctorRequestDTO): Observable<ResponseData<DoctorResponseDTO>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.put<ResponseData<DoctorResponseDTO>>(
      `${this.apiUrl}/update-doctor`,
      doctorData,
      {
        ...this.apiConfig,
        params
      }
    );
  }

  /**
   * Delete a doctor by ID
   */
  deleteDoctor(id: number): Observable<ResponseData<null>> {
    return this.http.delete<ResponseData<null>>(
      `${this.apiUrl}/delete-doctor/${id}`,
      this.apiConfig
    );
  }

  /**
   * Helper method to check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return token !== null && token.length >= this.minTokenLength;
  }

  /**
   * Helper method to get current user token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Helper method to clear authentication
   */
  clearAuth(): void {
    localStorage.removeItem('accessToken');
  }
}