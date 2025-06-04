import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService, PatientRequestDTO } from '../../services/patient.service'; // Đường dẫn phù hợp với cấu trúc project

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css'
})
export class CreatePatientComponent {
  // Khai báo các biến form
  full_Name: string = '';
  date_of_birth: string = '';
  gender: string = '';
  phone_Number: string = '';
  address: string = '';
  id_Number: string = '';
  email: string = '';
  blood_type: string = '';
  marital_status: string = '';
  occupation: string = '';
  allergies: string = '';

  // Loading state
  isLoading: boolean = false;

  // Validation errors
  formErrors: string[] = [];

  // Inject dependencies
  private patientService = inject(PatientService);
  private router = inject(Router);

  constructor() {
    this.resetForm();
  }

  // Reset form
  resetForm(): void {
    this.full_Name = '';
    this.date_of_birth = '';
    this.gender = '';
    this.phone_Number = '';
    this.address = '';
    this.id_Number = '';
    this.email = '';
    this.blood_type = '';
    this.marital_status = '';
    this.occupation = '';
    this.allergies = '';
    this.formErrors = [];
  }

  // Get current form data as PatientRequestDTO
  private getCurrentFormData(): PatientRequestDTO {
    return this.patientService.createPatientDTO({
      full_Name: this.full_Name,
      date_of_birth: this.date_of_birth,
      gender: this.gender,
      phone_Number: this.phone_Number,
      address: this.address,
      id_Number: this.id_Number,
      email: this.email,
      blood_type: this.blood_type,
      marital_status: this.marital_status,
      occupation: this.occupation,
      allergies: this.allergies
    });
  }

  // Validate form using service
  private validateForm(): boolean {
    const patientData = this.getCurrentFormData();
    const validation = this.patientService.validatePatientData(patientData);

    this.formErrors = validation.errors;

    if (!validation.isValid) {
      this.showError(validation.errors.join(', '));
      return false;
    }

    return true;
  }

  // Submit form
  onSubmit(): void {
    // Clear previous errors
    this.formErrors = [];

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    // Set loading state
    this.isLoading = true;

    // Get form data
    const patientData = this.getCurrentFormData();

    console.log('Sending patient data:', patientData);

    // Call service to create patient
    this.patientService.createPatient(patientData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Response received:', response);

        if (response.code === 200) {
          this.showSuccess('Thêm bệnh nhân thành công!');
          this.resetForm();

          // Có thể redirect đến trang danh sách bệnh nhân
          // this.router.navigate(['/patients']);
        } else {
          this.showError(response.message || 'Có lỗi xảy ra');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating patient:', error);

        // Use service's error handler
        const errorMessage = this.patientService.handleError(error);
        this.showError(errorMessage);
      }
    });
  }

  // Reset form handler
  onReset(): void {
    this.resetForm();
    this.showInfo('Đã làm mới form');
  }

  // Cancel handler
  onCancel(): void {
    if (this.hasUnsavedChanges()) {
      const confirmLeave = confirm('Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn thoát?');
      if (!confirmLeave) {
        return;
      }
    }

    this.resetForm();
    this.router.navigate(['/patient']);
  }

  // Check if form has unsaved changes
  private hasUnsavedChanges(): boolean {
    return !!(
      this.full_Name.trim() ||
      this.date_of_birth ||
      this.gender ||
      this.phone_Number.trim() ||
      this.address.trim() ||
      this.id_Number.trim() ||
      this.email.trim() ||
      this.blood_type ||
      this.marital_status ||
      this.occupation.trim() ||
      this.allergies.trim()
    );
  }

  // Check if specific field has error
  hasFieldError(fieldName: string): boolean {
    return this.formErrors.some(error => 
      error.toLowerCase().includes(this.getFieldDisplayName(fieldName).toLowerCase())
    );
  }

  // Get display name for field
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'full_Name': 'Họ và tên',
      'date_of_birth': 'Ngày sinh',
      'gender': 'Giới tính',
      'phone_Number': 'Số điện thoại',
      'address': 'Địa chỉ',
      'id_Number': 'Số CCCD/CMND',
      'email': 'Email'
    };
    return fieldNames[fieldName] || fieldName;
  }

  // Get errors for specific field
  getFieldErrors(fieldName: string): string[] {
    const displayName = this.getFieldDisplayName(fieldName);
    return this.formErrors.filter(error => 
      error.toLowerCase().includes(displayName.toLowerCase())
    );
  }

  // Utility methods for showing messages
  private showSuccess(message: string): void {
    alert(message); // TODO: Thay thế bằng toast notification service
  }

  private showError(message: string): void {
    alert(message); // TODO: Thay thế bằng toast notification service
  }

  private showInfo(message: string): void {
    alert(message); // TODO: Thay thế bằng toast notification service
  }

  // Additional utility methods for template

  // Check if form is valid (for enabling/disabling submit button)
  isFormValid(): boolean {
    const patientData = this.getCurrentFormData();
    return this.patientService.validatePatientData(patientData).isValid;
  }

  // Get form completion percentage
  getFormCompletionPercentage(): number {
    const requiredFields = [
      this.full_Name.trim(),
      this.date_of_birth,
      this.gender,
      this.phone_Number.trim(),
      this.address.trim(),
      this.id_Number.trim()
    ];

    const optionalFields = [
      this.email.trim(),
      this.blood_type,
      this.marital_status,
      this.occupation.trim(),
      this.allergies.trim()
    ];

    const completedRequired = requiredFields.filter(field => !!field).length;
    const completedOptional = optionalFields.filter(field => !!field).length;

    return Math.round(((completedRequired + completedOptional * 0.5) / (requiredFields.length + optionalFields.length * 0.5)) * 100);
  }

  // Phone number formatting (optional)
  formatPhoneNumber(): void {
    // Remove all non-digits
    let cleaned = this.phone_Number.replace(/\D/g, '');

    // Limit to 11 digits
    if (cleaned.length > 11) {
      cleaned = cleaned.substring(0, 11);
    }

    this.phone_Number = cleaned;
  }

  // ID number formatting (optional)
  formatIdNumber(): void {
    // Remove all non-digits
    let cleaned = this.id_Number.replace(/\D/g, '');

    // Limit to 12 digits
    if (cleaned.length > 12) {
      cleaned = cleaned.substring(0, 12);
    }

    this.id_Number = cleaned;
  }
}
// import { Component, OnInit, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Router } from '@angular/router';

// interface PatientRequestDTO {
//   full_Name: string;
//   date_of_birth: string;
//   gender: string;
//   phone_Number: string;
//   address: string;
//   id_Number: string;
//   email: string;
//   blood_type: string;
//   marital_status: string;
//   occupation: string;
//   allergies: string;
// }


// interface ResponseData<T> {
//   code: number;
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
// export class CreatePatientComponent {
//   // Khai báo các biến
//   full_Name: string = '';
//   date_of_birth: string = '';
//   gender: string = '';
//   phone_Number: string = '';
//   address: string = '';
//   id_Number: string = '';
//   email: string = '';
//   blood_type: string = '';
//   marital_status: string = '';
//   occupation: string = '';
//   allergies: string = '';

//   // Loading state
//   isLoading: boolean = false;

//   // Inject dependencies
//   private http = inject(HttpClient);
//   private router = inject(Router);

//   // API endpoint
//   private apiUrl = 'http://localhost:8080/patient'; // Thay đổi URL theo cấu hình backend của bạn

//   constructor() {
//     this.resetForm();
//   }

//   // Reset form
//   resetForm(): void {
//     this.full_Name = '';
//     this.date_of_birth = '';
//     this.gender = '';
//     this.phone_Number = '';
//     this.address = '';
//     this.id_Number = '';
//     this.email = '';
//     this.blood_type = '';
//     this.marital_status = '';
//     this.occupation = '';
//     this.allergies = '';
//   }

//   // Validate form inputs
//   validateForm(): boolean {
//     // Validate required fields
//     if (!this.full_Name.trim()) {
//       this.showError('Vui lòng nhập họ và tên');
//       return false;
//     }

//     if (!this.date_of_birth) {
//       this.showError('Vui lòng chọn ngày sinh');
//       return false;
//     }

//     if (!this.gender) {
//       this.showError('Vui lòng chọn giới tính');
//       return false;
//     }

//     if (!this.phone_Number.trim()) {
//       this.showError('Vui lòng nhập số điện thoại');
//       return false;
//     }

//     if (!this.address.trim()) {
//       this.showError('Vui lòng nhập địa chỉ');
//       return false;
//     }

//     if (!this.id_Number.trim()) {
//       this.showError('Vui lòng nhập số CCCD/CMND');
//       return false;
//     }

//     // Validate phone number format
//     const phoneRegex = /^[0-9]{10,11}$/;
//     if (!phoneRegex.test(this.phone_Number)) {
//       this.showError('Số điện thoại phải có 10-11 chữ số');
//       return false;
//     }

//     // Validate ID number format
//     const idRegex = /^[0-9]{9,12}$/;
//     if (!idRegex.test(this.id_Number)) {
//       this.showError('Số CCCD/CMND phải có 9-12 chữ số');
//       return false;
//     }

//     // Validate email format if provided
//     if (this.email && this.email.trim()) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(this.email)) {
//         this.showError('Email không hợp lệ');
//         return false;
//       }
//     }

//     return true;
//   }

//   // Create patient DTO
//   private createPatientDTO(): PatientRequestDTO {
//     return {
//       full_Name: this.full_Name.trim(),
//       date_of_birth: this.date_of_birth,
//       gender: this.gender,
//       phone_Number: this.phone_Number.trim(),
//       address: this.address.trim(),
//       id_Number: this.id_Number.trim(),
//       email: this.email.trim(),
//       blood_type: this.blood_type || '',
//       marital_status: this.marital_status || '',
//       occupation: this.occupation.trim(),
//       allergies: this.allergies.trim()
//     };
//   }

//   // Submit form
//   onSubmit(): void {
//     if (!this.validateForm()) {
//       return;
//     }

//     this.isLoading = true;

//     const patientData = this.createPatientDTO();

//     console.log('Sending patient data:', patientData);

//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json'
//     });

//     this.http.post<ResponseData<any>>(`${this.apiUrl}/create-patient`, patientData, { headers })
//       .subscribe({
//         next: (response) => {
//           this.isLoading = false;
//           console.log('Response received:', response);
//           if (response.code === 200) {
//             this.showSuccess('Thêm bệnh nhân thành công!');
//             this.resetForm();
//             // Có thể redirect đến trang danh sách bệnh nhân
//             // this.router.navigate(['/patients']);
//           } else {
//             this.showError(response.message || 'Có lỗi xảy ra');
//           }
//         },
//         error: (error: HttpErrorResponse) => {
//           this.isLoading = false;
//           console.error('Error creating patient:', error);
//           console.error('Error response:', error.error);

//           if (error.status === 0) {
//             this.showError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
//           } else if (error.status === 400) {
//             this.showError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
//           } else if (error.status === 500) {
//             this.showError('Lỗi server. Vui lòng thử lại sau.');
//           } else {
//             this.showError(`Có lỗi xảy ra: ${error.message}`);
//           }
//         }
//       });
//   }

//   // Reset form handler
//   onReset(): void {
//     this.resetForm();
//     this.showInfo('Đã làm mới form');
//   }

//   // Cancel handler
//   onCancel(): void {
//     this.resetForm();
//     // Có thể redirect về trang trước
//     this.router.navigate(['/patient']);
//   }

//   // Utility methods for showing messages
//   private showSuccess(message: string): void {
//     alert(message); // Thay thế bằng toast notification service
//   }

//   private showError(message: string): void {
//     alert(message); // Thay thế bằng toast notification service
//   }

//   private showInfo(message: string): void {
//     alert(message); // Thay thế bằng toast notification service
//   }
// }