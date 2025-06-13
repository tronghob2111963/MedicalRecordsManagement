import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// Medical Record Request DTO based on Java MedicalRecordRequestDTO
export interface MedicalRecordRequestDTO {
  patient_id: number;
  doctor_id: number;
  diagnosis: string;
  treatment: string;
  visit_date: string; // Format: YYYY-MM-DD
  note: string;
  status?: string; // Default: "Under_treatment"
}

// Response interfaces based on Java DTOs
export interface MedicalRecordDetailResponse {
  id: number;
  patient_id: number;
  doctor_id: number;
  patient_Name: string;
  doctor_Name: string; // Note: keeping original typo from Java code
  diagnosis: string;
  treatment: string;
  visit_date: string;
  note: string;
  status: string;

}

export interface MedicalRecordResponse {
  id: number;
  patient_Name: string;
  doctor_Name: string;
  status:string;
  note: string;
}

export interface PageResponse<T> {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  items: T[];
}

export interface ResponseData<T> {
  status: number;
  code: number;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalrecordService {
  private readonly baseUrl = 'http://localhost:8080/medical-records'; // Adjust base URL as needed

  constructor(private http: HttpClient) { }

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
   * Create a new medical record
   * Requires ADMIN or DOCTOR role
   */
  createMedicalRecord(medicalRecord: MedicalRecordRequestDTO): Observable<ResponseData<MedicalRecordDetailResponse>> {
    // Set default status if not provided
    const requestData: MedicalRecordRequestDTO = {
      ...medicalRecord,
      status: medicalRecord.status || 'Under_treatment'
    };

    return this.http.post<ResponseData<MedicalRecordDetailResponse>>(`${this.baseUrl}/create`,
      requestData,
    this.apiConfig);
  }

  /**
   * Get all medical records with pagination and sorting
   * Requires ADMIN role
   */
  getAllMedicalRecords(
    pageNo: number = 1,
    pageSize: number = 10,
    sortBy: string = 'Id:asc'
  ): Observable<ResponseData<PageResponse<MedicalRecordResponse>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy);

    return this.http.get<ResponseData<PageResponse<MedicalRecordResponse>>>(
     `${this.baseUrl}/all-medical-records`,
      { ...this.apiConfig, params }
    );
  }

  getMedicalRecordById(id: number): Observable<ResponseData<MedicalRecordDetailResponse>> {
      const params = new HttpParams().set('id', id.toString());
      return this.http.get<ResponseData<MedicalRecordDetailResponse>>(
        `${this.baseUrl}/medical-record/${id}`,
        {
          ...this.apiConfig,
          params
        }
      );
    }

  /**
   * Get medical records by patient ID with pagination and sorting
   * Requires ADMIN role
   */
  getMedicalRecordsByPatientId(
    patientId: number,
    pageNo: number = 1,
    pageSize: number = 10,
    sortBy: string = 'patient_id:asc'
  ): Observable<ResponseData<PageResponse<MedicalRecordResponse>>> {
    const params = new HttpParams()
      .set('patient_id', patientId.toString())
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy);

    return this.http.get<ResponseData<PageResponse<MedicalRecordResponse>>>(
      `${this.baseUrl}/patient-record/${patientId}`,
      { params }
    );
  }

  /**
   * Get medical records by doctor ID with pagination and sorting
   * Requires ADMIN or DOCTOR role
   */
  getMedicalRecordsByDoctorId(
    doctorId: number,
    pageNo: number = 1,
    pageSize: number = 10,
    sortBy: string = 'doctor_id:asc'
  ): Observable<ResponseData<PageResponse<MedicalRecordResponse>>> {
    const params = new HttpParams()
      .set('doctor_id', doctorId.toString())
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy);

    return this.http.get<ResponseData<PageResponse<MedicalRecordResponse>>>(
      `${this.baseUrl}/doctor-record/${doctorId}`,
      { params }
    );
  }

  /**
   * Update a medical record
   * Requires ADMIN or DOCTOR role
   */
  updateMedicalRecord(id: number, medicalRecord: MedicalRecordRequestDTO): Observable<ResponseData<MedicalRecordResponse>> {
    // Set default status if not provided
    const requestData: MedicalRecordRequestDTO = {
      ...medicalRecord,
      status: medicalRecord.status || 'Under_treatment'
    };
    return this.http.put<ResponseData<MedicalRecordResponse>>(
      `${this.baseUrl}/update/${id}`,
      requestData,
      {
        ...this.apiConfig,
      }
    );
  }

  /**
   * Delete a medical record
   * Requires ADMIN role
   */
  deleteMedicalRecord(id: number): Observable<ResponseData<string>> {
    return this.http.delete<ResponseData<string>>(`${this.baseUrl}/delete/${id}`, this.apiConfig);
  }

  // Helper methods for error handling and data transformation

  /**
   * Extract data from ResponseData wrapper
   */
  extractData<T>(response: ResponseData<T>): T | null {
    return response.data || null;
  }

  /**
   * Check if response is successful
   */
  isSuccessResponse<T>(response: ResponseData<T>): boolean {
    return response.code === 200;
  }

  /**
   * Get error message from response
   */
  getErrorMessage<T>(response: ResponseData<T>): string {
    return response.message || 'Unknown error occurred';
  }

  // Convenience methods for common operations

  /**
   * Create medical record and return unwrapped data
   */
  createMedicalRecordSimple(medicalRecord: MedicalRecordRequestDTO): Observable<MedicalRecordDetailResponse | null> {
    return new Observable(observer => {
      this.createMedicalRecord(medicalRecord).subscribe({
        next: (response) => {
          if (this.isSuccessResponse(response)) {
            observer.next(this.extractData(response));
          } else {
            observer.error(new Error(this.getErrorMessage(response)));
          }
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Get all medical records and return unwrapped data
   */
  getAllMedicalRecordsSimple(
    pageNo?: number,
    pageSize?: number,
    sortBy?: string
  ): Observable<PageResponse<MedicalRecordResponse> | null> {
    return new Observable(observer => {
      this.getAllMedicalRecords(pageNo, pageSize, sortBy).subscribe({
        next: (response) => {
          if (this.isSuccessResponse(response)) {
            observer.next(this.extractData(response));
          } else {
            observer.error(new Error(this.getErrorMessage(response)));
          }
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}