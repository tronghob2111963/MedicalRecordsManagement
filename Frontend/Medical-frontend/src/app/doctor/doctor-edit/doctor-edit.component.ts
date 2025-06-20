import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService, DoctorRequestDTO, DoctorResponseDTO, ResponseData } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-edit.component.html',
  styleUrl: './doctor-edit.component.css'
})
export class DoctorEditComponent implements OnInit {
  doctorForm: FormGroup;
  isEditMode = false;
  doctorId: number | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Doctor status options
  statusOptions = [
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'INACTIVE', label: 'Không hoạt động' },
    { value: 'PENDING', label: 'Chờ duyệt' }
  ];

  // Medical specialties
  specialtyOptions = [
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

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.doctorForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.doctorService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.doctorId = +params['id'];
        this.loadDoctorData(this.doctorId);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      specialty: ['', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      license_Number: ['', [Validators.required, Validators.minLength(5)]],
      status: ['ACTIVE', [Validators.required]]
    });
  }

  private loadDoctorData(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.doctorService.getDoctorById(id).subscribe({
      next: (response: ResponseData<DoctorResponseDTO>) => {
        if (response.status === 200 && response.data) {
          this.populateForm(response.data);
        } else {
          this.errorMessage = response.message || 'Failed to load doctor data';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctor:', error);
        this.errorMessage = 'Failed to load doctor data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private populateForm(doctor: DoctorResponseDTO): void {
    this.doctorForm.patchValue({
      full_name: doctor.full_name,
      specialty: doctor.specialty,
      phone_number: doctor.phone_number,
      email: doctor.email,
      license_Number: doctor.license_Number,
      status: doctor.status
    });
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const doctorData: DoctorRequestDTO = this.doctorForm.value;

    if (this.isEditMode && this.doctorId) {
      this.updateDoctor(this.doctorId, doctorData);
    } else {
      this.createDoctor(doctorData);
    }
  }

  private createDoctor(doctorData: DoctorRequestDTO): void {
    this.doctorService.createDoctor(doctorData).subscribe({
      next: (response: ResponseData<DoctorResponseDTO>) => {
        if (response.status === 200 || response.status === 201) {
          this.successMessage = 'Doctor created successfully!';
          setTimeout(() => {
            this.router.navigate(['/doctors']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Failed to create doctor';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating doctor:', error);
        this.errorMessage = 'Failed to create doctor. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private updateDoctor(id: number, doctorData: DoctorRequestDTO): void {
    this.doctorService.updateDoctor(id, doctorData).subscribe({
      next: (response: ResponseData<DoctorResponseDTO>) => {
        if (response.status === 200) {
          this.successMessage = 'Doctor updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/doctors']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Failed to update doctor';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating doctor:', error);
        this.errorMessage = 'Failed to update doctor. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin']);
  }

  onReset(): void {
    if (this.isEditMode && this.doctorId) {
      this.loadDoctorData(this.doctorId);
    } else {
      this.doctorForm.reset();
      this.doctorForm.patchValue({ status: 'ACTIVE' });
    }
    this.errorMessage = '';
    this.successMessage = '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.doctorForm.controls).forEach(key => {
      const control = this.doctorForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.doctorForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.doctorForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'full_name': 'Full Name',
      'specialty': 'Specialty',
      'phone_number': 'Phone Number',
      'email': 'Email',
      'license_Number': 'License Number',
      'status': 'Status'
    };
    return labels[fieldName] || fieldName;
  }
}