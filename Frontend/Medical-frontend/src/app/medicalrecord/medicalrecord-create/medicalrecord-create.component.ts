import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicalrecordService, MedicalRecordRequestDTO } from '../../services/medicalrecord.service';

@Component({
  selector: 'app-medicalrecord-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medicalrecord-create.component.html',
  styleUrl: './medicalrecord-create.component.css'
})
export class MedicalrecordCreateComponent implements OnInit {
  medicalRecordForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Options for status dropdown
  statusOptions = [
    { value: 'Under_treatment', label: 'Đang điều trị' },
    { value: 'Completed', label: 'Hoàn thành' },
    { value: 'Cancelled', label: 'Đã hủy' }
  ];

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalrecordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.medicalRecordForm = this.fb.group({
      patient_id: ['', [Validators.required, Validators.min(1)]],
      doctor_id: ['', [Validators.required, Validators.min(1)]],
      diagnosis: ['', [Validators.required, Validators.minLength(3)]],
      treatment: ['', [Validators.required, Validators.minLength(3)]],
      visit_date: ['', Validators.required],
      Note: [''],
      status: ['Under_treatment', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.medicalRecordForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData: MedicalRecordRequestDTO = this.medicalRecordForm.value;

      this.medicalRecordService.createMedicalRecord(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (this.medicalRecordService.isSuccessResponse(response)) {
            this.successMessage = 'Tạo hồ sơ bệnh án thành công!';
            this.medicalRecordForm.reset();
            this.medicalRecordForm.patchValue({ status: 'Under_treatment' });
            
            // Redirect after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/medical-records']);
            }, 2000);
          } else {
            this.errorMessage = this.medicalRecordService.getErrorMessage(response);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Có lỗi xảy ra khi tạo hồ sơ bệnh án. Vui lòng thử lại.';
          console.error('Error creating medical record:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.medicalRecordForm.controls).forEach(key => {
      const control = this.medicalRecordForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.medicalRecordForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.medicalRecordForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Trường này là bắt buộc';
      }
      if (field.errors['min']) {
        return 'Giá trị phải lớn hơn 0';
      }
      if (field.errors['minlength']) {
        return `Tối thiểu ${field.errors['minlength'].requiredLength} ký tự`;
      }
    }
    return '';
  }

  onReset(): void {
    this.medicalRecordForm.reset();
    this.medicalRecordForm.patchValue({ status: 'Under_treatment' });
    this.errorMessage = '';
    this.successMessage = '';
  }

  onCancel(): void {
    this.router.navigate(['/admin']);
  }
}