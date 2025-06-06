import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService, PatientRequestDTO } from '../../services/patient.service';

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
    return {
      full_Name: this.full_Name.trim(),
      date_of_birth: this.date_of_birth,
      gender: this.gender,
      phone_Number: this.phone_Number.trim(),
      address: this.address.trim(),
      id_Number: this.id_Number.trim(),
      email: this.email.trim(),
      blood_type: this.blood_type || undefined,
      marital_status: this.marital_status || undefined,
      occupation: this.occupation.trim() || undefined,
      allergies: this.allergies.trim() || undefined
    };
  }

  // Validate form
  private validateForm(): boolean {
    this.formErrors = [];

    const patientData = this.getCurrentFormData();

    // Validate required fields
    if (!patientData.full_Name) {
      this.formErrors.push('Họ và tên là bắt buộc');
    }

    if (!patientData.date_of_birth) {
      this.formErrors.push('Ngày sinh là bắt buộc');
    } else {
      // Validate date format and age
      const birthDate = new Date(patientData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (birthDate > today) {
        this.formErrors.push('Ngày sinh không thể lớn hơn ngày hiện tại');
      } else if (age > 150) {
        this.formErrors.push('Tuổi không hợp lệ');
      }
    }

    if (!patientData.gender) {
      this.formErrors.push('Giới tính là bắt buộc');
    }

    if (!patientData.phone_Number) {
      this.formErrors.push('Số điện thoại là bắt buộc');
    } else if (!/^[0-9]{10,11}$/.test(patientData.phone_Number)) {
      this.formErrors.push('Số điện thoại phải có 10-11 chữ số');
    }

    if (!patientData.address) {
      this.formErrors.push('Địa chỉ là bắt buộc');
    }

    if (!patientData.id_Number) {
      this.formErrors.push('Số CCCD/CMND là bắt buộc');
    } else if (!/^[0-9]{9,12}$/.test(patientData.id_Number)) {
      this.formErrors.push('Số CCCD/CMND phải có 9-12 chữ số');
    }

    // Validate email if provided
    if (patientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)) {
      this.formErrors.push('Email không hợp lệ');
    }

    return this.formErrors.length === 0;
  }

  // Submit form
  onSubmit(): void {
    // Clear previous errors
    this.formErrors = [];

    // Validate form
    if (!this.validateForm()) {
      this.showError(this.formErrors.join('. '));
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

        if (response.status === 200) {
          this.showSuccess('Thêm bệnh nhân thành công!');
          this.resetForm();

          // Navigate to patient list
          setTimeout(() => {
            this.router.navigate(['/patients']);
          }, 1000);
        } else {
          this.showError(response.message || 'Có lỗi xảy ra');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating patient:', error);

        let errorMessage = 'Có lỗi xảy ra khi thêm bệnh nhân';
        
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status === 400) {
          errorMessage = 'Dữ liệu không hợp lệ';
        } else if (error.status === 401) {
          errorMessage = 'Bạn không có quyền thực hiện thao tác này';
        } else if (error.status === 500) {
          errorMessage = 'Lỗi máy chủ nội bộ';
        }

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
    this.router.navigate(['/patients']);
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

  // Check if form is valid (for enabling/disabling submit button)
  isFormValid(): boolean {
    return this.validateForm();
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

  // Phone number formatting
  formatPhoneNumber(): void {
    // Remove all non-digits
    let cleaned = this.phone_Number.replace(/\D/g, '');

    // Limit to 11 digits
    if (cleaned.length > 11) {
      cleaned = cleaned.substring(0, 11);
    }

    this.phone_Number = cleaned;
  }

  // ID number formatting
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