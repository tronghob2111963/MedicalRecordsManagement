import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interfaces

//du liệu bệnh nhân gửi từ client lên server
export interface PatientRequestDTO {
  full_Name: string;
  date_of_birth: string;
  gender: string;
  phone_Number: string;
  address: string;
  id_Number: string;
  email: string;
  blood_type: string;
  marital_status: string;
  occupation: string;
  allergies: string;
}


// Dữ liệu bệnh nhân trả về từ server
export interface PatientResponseDTO {
  id: number;
  full_Name: string;
  date_of_birth: string;
  gender: string;
  phone_Number: string;
  address: string;
  id_Number: string;
  email: string;
  blood_type: string;
  marital_status: string;
  occupation: string;
  allergies: string;
  created_at?: string;
  updated_at?: string;
}

export interface PatientListResponseDTO{
  full_Name: string;
  gender: string;
  date_of_birth: string;
  phone_Number: string;
  address: string;
}

export interface ResponseData<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})

export class PatientService {
  private apiUrl = 'http://localhost:8080/patient';

  // HTTP headers mặc định
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Tạo bệnh nhân mới
   * @param patientData - Dữ liệu bệnh nhân
   * @returns Observable<ResponseData<PatientResponseDTO>>
   */
  createPatient(patientData: PatientRequestDTO): Observable<ResponseData<PatientResponseDTO>> {
    return this.http.post<ResponseData<PatientResponseDTO>>(
      `${this.apiUrl}/create-patient`,
      patientData,
      this.httpOptions
    );
  }

  /**
   * Lấy danh sách tất cả bệnh nhân
   * @returns Observable<ResponseData<PatientResponseDTO[]>>
   */
  getAllPatients(): Observable<ResponseData<PatientResponseDTO[]>> {
    return this.http.get<ResponseData<PatientResponseDTO[]>>(`${this.apiUrl}/all-patients`);
  }

  /**
   * Lấy thông tin bệnh nhân theo ID
   * @param id - ID của bệnh nhân
   * @returns Observable<ResponseData<PatientResponseDTO>>
   */
  getPatientById(id: number): Observable<ResponseData<PatientResponseDTO>> {
    return this.http.get<ResponseData<PatientResponseDTO>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Tìm kiếm bệnh nhân theo số CCCD/CMND
   * @param idNumber - Số CCCD/CMND
   * @returns Observable<ResponseData<PatientResponseDTO>>
   */
  getPatientByIdNumber(idNumber: string): Observable<ResponseData<PatientResponseDTO>> {
    return this.http.get<ResponseData<PatientResponseDTO>>(`${this.apiUrl}/id-number/${idNumber}`);
  }

  /**
   * Tìm kiếm bệnh nhân theo số điện thoại
   * @param phoneNumber - Số điện thoại
   * @returns Observable<ResponseData<PatientResponseDTO>>
   */
  getPatientByPhone(phoneNumber: string): Observable<ResponseData<PatientResponseDTO>> {
    return this.http.get<ResponseData<PatientResponseDTO>>(`${this.apiUrl}/phone/${phoneNumber}`);
  }

  /**
   * Cập nhật thông tin bệnh nhân
   * @param id - ID của bệnh nhân
   * @param patientData - Dữ liệu cập nhật
   * @returns Observable<ResponseData<PatientResponseDTO>>
   */
  updatePatient(id: number, patientData: PatientRequestDTO): Observable<ResponseData<PatientResponseDTO>> {
    return this.http.put<ResponseData<PatientResponseDTO>>(
      `${this.apiUrl}/update/${id}`,
      patientData,
      this.httpOptions
    );
  }

  /**
   * Xóa bệnh nhân
   * @param id - ID của bệnh nhân
   * @returns Observable<ResponseData<any>>
   */
  deletePatient(id: number): Observable<ResponseData<any>> {
    return this.http.delete<ResponseData<any>>(`${this.apiUrl}/delete/${id}`);
  }

  /**
   * Tìm kiếm bệnh nhân theo tên (partial search)
   * @param name - Tên cần tìm
   * @returns Observable<ResponseData<PatientResponseDTO[]>>
   */
  searchPatientsByName(name: string): Observable<ResponseData<PatientResponseDTO[]>> {
    return this.http.get<ResponseData<PatientResponseDTO[]>>(`${this.apiUrl}/search?name=${encodeURIComponent(name)}`);
  }

  /**
   * Validate dữ liệu bệnh nhân
   * @param patientData - Dữ liệu cần validate
   * @returns object chứa thông tin lỗi
   */
  validatePatientData(patientData: PatientRequestDTO): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate required fields
    if (!patientData.full_Name?.trim()) {
      errors.push('Họ và tên là bắt buộc');
    }

    if (!patientData.date_of_birth) {
      errors.push('Ngày sinh là bắt buộc');
    }

    if (!patientData.gender) {
      errors.push('Giới tính là bắt buộc');
    }

    if (!patientData.phone_Number?.trim()) {
      errors.push('Số điện thoại là bắt buộc');
    }

    if (!patientData.address?.trim()) {
      errors.push('Địa chỉ là bắt buộc');
    }

    if (!patientData.id_Number?.trim()) {
      errors.push('Số CCCD/CMND là bắt buộc');
    }

    // Validate format
    if (patientData.phone_Number) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(patientData.phone_Number)) {
        errors.push('Số điện thoại phải có 10-11 chữ số');
      }
    }

    if (patientData.id_Number) {
      const idRegex = /^[0-9]{9,12}$/;
      if (!idRegex.test(patientData.id_Number)) {
        errors.push('Số CCCD/CMND phải có 9-12 chữ số');
      }
    }

    if (patientData.email && patientData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(patientData.email)) {
        errors.push('Email không hợp lệ');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Tạo PatientRequestDTO từ form data
   * @param formData - Dữ liệu từ form
   * @returns PatientRequestDTO
   */
  createPatientDTO(formData: any): PatientRequestDTO {
    return {
      full_Name: formData.full_Name?.trim() || '',
      date_of_birth: formData.date_of_birth || '',
      gender: formData.gender || '',
      phone_Number: formData.phone_Number?.trim() || '',
      address: formData.address?.trim() || '',
      id_Number: formData.id_Number?.trim() || '',
      email: formData.email?.trim() || '',
      blood_type: formData.blood_type || '',
      marital_status: formData.marital_status || '',
      occupation: formData.occupation?.trim() || '',
      allergies: formData.allergies?.trim() || ''
    };
  }

  /**
   * Handle HTTP errors
   * @param error - HttpErrorResponse
   * @returns string error message
   */
  handleError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    } else if (error.status === 400) {
      return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
    } else if (error.status === 404) {
      return 'Không tìm thấy bệnh nhân.';
    } else if (error.status === 409) {
      return 'Bệnh nhân đã tồn tại trong hệ thống.';
    } else if (error.status === 500) {
      return 'Lỗi server. Vui lòng thử lại sau.';
    } else {
      return `Có lỗi xảy ra: ${error.message}`;
    }
  }
}