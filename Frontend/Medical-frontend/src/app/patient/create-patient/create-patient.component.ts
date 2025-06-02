import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

// Interface để định nghĩa cấu trúc dữ liệu, sử dụng snake_case để khớp với backend
interface PatientRequest {
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

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css'
})
export class CreatePatientComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Dữ liệu bệnh nhân - sử dụng snake_case để khớp với backend
  patient: PatientRequest = {
    full_Name: '',
    date_of_birth: '',
    gender: '',
    phone_Number: '',
    address: '',
    id_Number: '',
    email: '',
    blood_type: '',
    marital_status: '',
    occupation: '',
    allergies: ''
  };

  isLoading = false;
  private readonly API_BASE_URL = 'http://localhost:8080/patient/create-patient';

  ngOnInit(): void {
    console.log('Form khởi tạo thành công');
    console.log('HttpClient:', this.http);
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.createPatient();
  }

  private validateForm(): boolean {
    const requiredFields = [
      'full_Name', 'date_of_birth', 'gender',
      'phone_Number', 'address', 'id_Number'
    ];

    for (const field of requiredFields) {
      if (!this.patient[field as keyof PatientRequest]?.trim()) {
        alert(`Vui lòng điền đầy đủ thông tin: ${this.getFieldLabel(field)}`);
        return false;
      }
    }

    if (this.patient.email && !this.isValidEmail(this.patient.email)) {
      alert('Email không hợp lệ');
      return false;
    }

    if (!this.isValidPhoneNumber(this.patient.phone_Number)) {
      alert('Số điện thoại không hợp lệ (10-11 số)');
      return false;
    }

    if (!this.isValidIdNumber(this.patient.id_Number)) {
      alert('Số CCCD/CMND không hợp lệ (9-12 số)');
      return false;
    }

    return true;
  }

  private createPatient(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Sending data:', JSON.stringify(this.patient));
    this.http.post<ApiResponse<any>>(this.API_BASE_URL, this.patient, { headers })
      .subscribe({
        next: (response) => {
          console.log('Phản hồi từ server:', response);
          this.handleSuccess(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Lỗi từ server:', error);
          this.handleError(error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  private handleSuccess(response: ApiResponse<any>): void {
    if (response.status === 200 || response.status === 201) {
      alert(`Tạo bệnh nhân thành công!\nTên: ${this.patient.full_Name}`);
      this.router.navigate(['/patient']);
    } else {
      alert(`Có lỗi xảy ra: ${response.message}`);
    }
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Có lỗi xảy ra khi tạo bệnh nhân';

    switch (error.status) {
      case 400:
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        break;
      case 401:
        errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
        break;
      case 409:
        errorMessage = 'Bệnh nhân với số CCCD/CMND này đã tồn tại.';
        break;
      case 500:
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
        break;
      case 0:
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        break;
      default:
        errorMessage = `Lỗi ${error.status}: ${error.message}`;
    }

    alert(errorMessage);
  }

  onCancel(): void {
    if (this.hasUnsavedChanges()) {
      const confirmCancel = confirm('Bạn có muốn hủy? Dữ liệu chưa lưu sẽ bị mất.');
      if (!confirmCancel) {
        return;
      }
    }
    this.router.navigate(['/patient']);
  }

  private hasUnsavedChanges(): boolean {
    return Object.values(this.patient).some(value => value.trim() !== '');
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    const phonePattern = /^[0-9]{10,11}$/;
    return phonePattern.test(phone);
  }

  private isValidIdNumber(idNumber: string): boolean {
    const idPattern = /^[0-9]{9,12}$/;
    return idPattern.test(idNumber);
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      full_Name: 'Họ và tên',
      date_of_birth: 'Ngày sinh',
      gender: 'Giới tính',
      phone_Number: 'Số điện thoại',
      address: 'Địa chỉ',
      id_Number: 'Số CCCD/CMND',
      email: 'Email'
    };
    return labels[fieldName] || fieldName;
  }

  resetForm(): void {
    this.patient = {
      full_Name: '',
      date_of_birth: '',
      gender: '',
      phone_Number: '',
      address: '',
      id_Number: '',
      email: '',
      blood_type: '',
      marital_status: '',
      occupation: '',
      allergies: ''
    };
  }
}
// import { Component, OnInit, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Router } from '@angular/router';

// // Interface để định nghĩa cấu trúc dữ liệu
// interface PatientRequest {
//   fullName: string;
//   dateOfBirth: string;
//   gender: string;
//   phoneNumber: string;
//   address: string;
//   idNumber: string;
//   email: string;
//   bloodType: string;
//   maritalStatus: string;
//   occupation: string;
//   allergies: string;
// }

// interface ApiResponse<T> {
//   status: number;
//   message: string;
//   data: T;
// }

// @Component({
//   selector: 'app-create-patient',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './create-patient.component.html',
//   styleUrl: './create-patient.component.css'
// })
// export class CreatePatientComponent implements OnInit {
//   // Inject HttpClient và Router bằng inject()
//   private http = inject(HttpClient);
//   private router = inject(Router);

//   // Dữ liệu bệnh nhân - sử dụng camelCase để khớp với Spring Boot
//   patient: PatientRequest = {
//     fullName: '',
//     dateOfBirth: '',
//     gender: '',
//     phoneNumber: '',
//     address: '',
//     idNumber: '',
//     email: '',
//     bloodType: '',
//     maritalStatus: '',
//     occupation: '',
//     allergies: ''
//   };

//   // Trạng thái loading
//   isLoading = false;

//   // URL API - khớp với Spring Boot controller
//   private readonly API_BASE_URL = 'http://localhost:8080/patient/create-patient';
//   // private readonly API_BASE_URL = 'http://localhost:8080/api/patients';

//   ngOnInit(): void {
//     // Khởi tạo form nếu cần
//     console.log('Form khởi tạo thành công');
//     console.log('HttpClient:', this.http); // Kiểm tra xem HttpClient có được inject không
//   }

//   /**
//    * Xử lý submit form
//    */
//   onSubmit(): void {
//     if (!this.validateForm()) {
//       return;
//     }

//     this.isLoading = true;
//     this.createPatient();
//   }

//   /**
//    * Validate form trước khi submit
//    */
//   private validateForm(): boolean {
//     // Kiểm tra các trường bắt buộc
//     const requiredFields = [
//       'fullName', 'dateOfBirth', 'gender',
//       'phoneNumber', 'address', 'idNumber'
//     ];

//     for (const field of requiredFields) {
//       if (!this.patient[field as keyof PatientRequest]?.trim()) {
//         alert(`Vui lòng điền đầy đủ thông tin: ${this.getFieldLabel(field)}`);
//         return false;
//       }
//     }

//     // Validate email nếu có
//     if (this.patient.email && !this.isValidEmail(this.patient.email)) {
//       alert('Email không hợp lệ');
//       return false;
//     }

//     // Validate số điện thoại
//     if (!this.isValidPhoneNumber(this.patient.phoneNumber)) {
//       alert('Số điện thoại không hợp lệ (10-11 số)');
//       return false;
//     }

//     // Validate số CCCD/CMND
//     if (!this.isValidIdNumber(this.patient.idNumber)) {
//       alert('Số CCCD/CMND không hợp lệ (9-12 số)');
//       return false;
//     }

//     return true;
//   }

//   /**
//    * Gọi API tạo bệnh nhân
//    */
//   private createPatient(): void {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//     });

//     // Log dữ liệu gửi đi để debug
//     console.log('Đang gửi dữ liệu:', this.patient);

//     this.http.post<ApiResponse<any>>(this.API_BASE_URL, this.patient, { headers })
//       .subscribe({
//         next: (response) => {
//           console.log('Phản hồi từ server:', response);
//           this.handleSuccess(response);
//         },
//         error: (error: HttpErrorResponse) => {
//           console.error('Lỗi từ server:', error);
//           this.handleError(error);
//         },
//         complete: () => {
//           this.isLoading = false;
//         }
//       });
//   }

//   /**
//    * Xử lý khi tạo bệnh nhân thành công
//    */
//   private handleSuccess(response: ApiResponse<any>): void {
//     if (response.status === 200 || response.status === 201) {
//       alert(`Tạo bệnh nhân thành công!\nTên: ${this.patient.fullName}`);
//       // Chuyển hướng về danh sách bệnh nhân
//       this.router.navigate(['/patients']);
//     } else {
//       alert(`Có lỗi xảy ra: ${response.message}`);
//     }
//   }

//   /**
//    * Xử lý lỗi từ API
//    */
//   private handleError(error: HttpErrorResponse): void {
//     let errorMessage = 'Có lỗi xảy ra khi tạo bệnh nhân';

//     switch (error.status) {
//       case 400:
//         errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
//         break;
//       case 401:
//         errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
//         break;
//       case 409:
//         errorMessage = 'Bệnh nhân với số CCCD/CMND này đã tồn tại.';
//         break;
//       case 500:
//         errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
//         break;
//       case 0:
//         errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
//         break;
//       default:
//         errorMessage = `Lỗi ${error.status}: ${error.message}`;
//     }

//     alert(errorMessage);
//   }

//   /**
//    * Xử lý hủy form
//    */
//   onCancel(): void {
//     if (this.hasUnsavedChanges()) {
//       const confirmCancel = confirm('Bạn có muốn hủy? Dữ liệu chưa lưu sẽ bị mất.');
//       if (!confirmCancel) {
//         return;
//       }
//     }
//     // Quay lại trang trước hoặc trang danh sách
//     this.router.navigate(['/patients']);
//   }

//   /**
//    * Kiểm tra form có thay đổi chưa
//    */
//   private hasUnsavedChanges(): boolean {
//     return Object.values(this.patient).some(value => value.trim() !== '');
//   }

//   /**
//    * Validate email
//    */
//   private isValidEmail(email: string): boolean {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailPattern.test(email);
//   }

//   /**
//    * Validate số điện thoại
//    */
//   private isValidPhoneNumber(phone: string): boolean {
//     const phonePattern = /^[0-9]{10,11}$/;
//     return phonePattern.test(phone);
//   }

//   /**
//    * Validate số CCCD/CMND
//    */
//   private isValidIdNumber(idNumber: string): boolean {
//     const idPattern = /^[0-9]{9,12}$/;
//     return idPattern.test(idNumber);
//   }

//   /**
//    * Lấy label của field để hiển thị lỗi
//    */
//   private getFieldLabel(fieldName: string): string {
//     const labels: { [key: string]: string } = {
//       fullName: 'Họ và tên',
//       dateOfBirth: 'Ngày sinh',
//       gender: 'Giới tính',
//       phoneNumber: 'Số điện thoại',
//       address: 'Địa chỉ',
//       idNumber: 'Số CCCD/CMND',
//       email: 'Email'
//     };
//     return labels[fieldName] || fieldName;
//   }

//   /**
//    * Reset form
//    */
//   resetForm(): void {
//     this.patient = {
//       fullName: '',
//       dateOfBirth: '',
//       gender: '',
//       phoneNumber: '',
//       address: '',
//       idNumber: '',
//       email: '',
//       bloodType: '',
//       maritalStatus: '',
//       occupation: '',
//       allergies: ''
//     };
//   }
// }