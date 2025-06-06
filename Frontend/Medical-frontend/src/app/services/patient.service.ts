import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';

// Interface cho Patient Request DTO
export interface PatientRequestDTO {
  full_Name: string;
  date_of_birth: string; // Format: YYYY-MM-DD
  gender: string;
  phone_Number: string;
  address: string;
  email: string;
  id_Number: string;
  blood_type?: string;
  marital_status?: string;
  occupation?: string;
  allergies?: string;
}

// Interface cho Patient List Response DTO
export interface PatientListResponseDTO {
  full_Name: string;
  gender: string;
  date_Of_Birth: string;
  address: string;
  phone_Number: string;
}

// Interface cho Patient Detail Response DTO
export interface PatientDetailResponseDTO {
  full_Name: string;
  gender: string;
  date_Of_Birth: string;
  address: string;
  phone_Number: string;
  email: string;
  id_number?: string;
  blood_type?: string;
  marital_status?: string;
  occupation?: string;
  allergies?: string;
}

// Interface cho Page Response
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

// Interface cho Response Error
export interface ResponseError {
  status: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patient`;

  constructor(private http: HttpClient) { }
  private minTokenLength = 13;

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);
    return new HttpHeaders({
      // 'Content-Type': 'application/json',
      // 'Authorization': token ? `Bearer ${token}` : ''
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

  // Lấy danh sách tất cả bệnh nhân với phân trang
  getAllPatients(pageNo: number = 1, pageSize: number = 10, sortBy: string = 'ID:asc'): Observable<ResponseData<PageResponse<PatientListResponseDTO>>> {
    const params = {
      pageNo: pageNo.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy
    };

    return this.http.get<ResponseData<PageResponse<PatientListResponseDTO>>>(
      `${this.apiUrl}/all-patients`,
      {
        ...this.apiConfig,
        params: params
      }
    );
  }

  // Lấy thông tin chi tiết bệnh nhân theo ID
  getPatientById(id: number): Observable<ResponseData<PatientDetailResponseDTO>> {
    return this.http.get<ResponseData<PatientDetailResponseDTO>>(
      `${this.apiUrl}/patient-detail/${id}`,
      this.apiConfig
    );
  }

  // Tạo bệnh nhân mới
  createPatient(patientData: PatientRequestDTO): Observable<ResponseData<PatientDetailResponseDTO>> {
    return this.http.post<ResponseData<PatientDetailResponseDTO>>(
      `${this.apiUrl}/create-patient`,
      patientData,
      this.apiConfig
    );
  }

  // Cập nhật thông tin bệnh nhân
  updatePatient(idNumber: string, patientData: PatientRequestDTO): Observable<ResponseData<PatientDetailResponseDTO>> {
    return this.http.put<ResponseData<PatientDetailResponseDTO>>(
      `${this.apiUrl}/update-patient?id_number=${idNumber}`,
      patientData,
      this.apiConfig
    );
  }

  // Xóa bệnh nhân
  deletePatient(id: number): Observable<ResponseData<any>> {
    return this.http.delete<ResponseData<any>>(
      `${this.apiUrl}/delete-patient/${id}`,
      this.apiConfig
    );
  }
}

