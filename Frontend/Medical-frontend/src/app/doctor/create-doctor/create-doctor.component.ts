import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService, DoctorRequestDTO, ResponseError } from '../../services/doctor.service';

@Component({
  selector: 'app-create-doctor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.css'
})
export class CreateDoctorComponent implements OnInit {
  doctorForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Danh sách chuyên khoa
  specialties = [
    'Nội khoa',
    'Ngoại khoa',
    'Sản phụ khoa',
    'Nhi khoa',
    'Tim mạch',
    'Thần kinh',
    'Da liễu',
    'Mắt',
    'Tai Mũi Họng',
    'Răng Hàm Mặt',
    'Chấn thương chỉnh hình',
    'Tâm thần',
    'Ung bướu',
    'Hồi sức cấp cứu',
    'Khác'
  ];

  // Trạng thái bác sĩ
  statusOptions = [
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'INACTIVE', label: 'Không hoạt động' },
    { value: 'PENDING', label: 'Chờ duyệt' }
  ];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.doctorForm = this.fb.group({
      full_name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      specialty: ['', Validators.required],
      phone_number: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10,11}$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      license_number: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      status: ['ACTIVE', Validators.required]
    });
  }

  // Getter methods để dễ dàng truy cập form controls
  get fullName() { return this.doctorForm.get('full_name'); }
  get specialty() { return this.doctorForm.get('specialty'); }
  get phoneNumber() { return this.doctorForm.get('phone_number'); }
  get email() { return this.doctorForm.get('email'); }
  get licenseNumber() { return this.doctorForm.get('license_number'); }
  get status() { return this.doctorForm.get('status'); }

  onSubmit(): void {
    if (this.doctorForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const doctorData: DoctorRequestDTO = {
        full_name: this.doctorForm.value.full_name.trim(),
        specialty: this.doctorForm.value.specialty,
        phone_number: this.doctorForm.value.phone_number.trim(),
        email: this.doctorForm.value.email.trim().toLowerCase(),
        license_number: this.doctorForm.value.license_number.trim(),
        status: this.doctorForm.value.status
      };

      this.doctorService.createDoctor(doctorData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = 'Tạo bác sĩ thành công!';
          console.log('Doctor created successfully:', response);

          // Reset form sau 2 giây và chuyển về danh sách
          setTimeout(() => {
            this.doctorForm.reset();
            this.doctorForm.patchValue({ status: 'ACTIVE' });
            this.router.navigate(['/create-user']); // Adjust route as needed
          }, 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating doctor:', error);

          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 401) {
            this.errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
          } else if (error.status === 400) {
            this.errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
          } else if (error.status === 409) {
            this.errorMessage = 'Email hoặc số giấy phép đã tồn tại.';
          } else {
            this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin hợp lệ.';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.doctorForm.controls).forEach(key => {
      const control = this.doctorForm.get(key);
      control?.markAsTouched();
    });
  }

  onReset(): void {
    this.doctorForm.reset();
    this.doctorForm.patchValue({ status: 'ACTIVE' });
    this.errorMessage = '';
    this.successMessage = '';
  }

  onCancel(): void {
    this.router.navigate(['/admin']); // Adjust route as needed
  }

  // Helper method để hiển thị lỗi validation
  getFieldError(fieldName: string): string {
    const field = this.doctorForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} là bắt buộc.`;
      if (field.errors['email']) return 'Email không hợp lệ.';
      if (field.errors['pattern']) return `${this.getFieldLabel(fieldName)} không đúng định dạng.`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} quá ngắn.`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} quá dài.`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'full_name': 'Họ và tên',
      'specialty': 'Chuyên khoa',
      'phone_number': 'Số điện thoại',
      'email': 'Email',
      'license_number': 'Số giấy phép',
      'status': 'Trạng thái'
    };
    return labels[fieldName] || fieldName;
  }

  // Check if field has error
  hasFieldError(fieldName: string): boolean {
    const field = this.doctorForm.get(fieldName);
    return !!(field && field.errors && field.touched);
  }
}