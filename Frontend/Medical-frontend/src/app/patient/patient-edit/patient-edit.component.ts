import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientDetailResponseDTO, PatientService, ResponseData } from '../../services/patient.service';

@Component({
  selector: 'app-patient-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-edit.component.html',
  styleUrl: './patient-edit.component.css'
})
export class PatientEditComponent implements OnInit {
  patientForm: FormGroup;
  patient: PatientDetailResponseDTO | null = null;
  loading = true;
  saving = false;
  error: string | null = null;
  patientId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private formBuilder: FormBuilder
  ) {
    this.patientForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = +params['id'];
      if (this.patientId) {
        this.loadPatientDetail();
      } else {
        this.error = 'Invalid patient ID';
        this.loading = false;
      }
    });
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      full_Name: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      id_Number: [''],
      phone_Number: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      email: ['', [Validators.email]],
      address: ['', Validators.required],
      blood_type: [''],
      allergies: [''],
      marital_status: [''],
      occupation: ['']
    });
  }

  loadPatientDetail(): void {
    this.loading = true;
    this.error = null;

    this.patientService.getPatientById(this.patientId).subscribe({
      next: (response: ResponseData<PatientDetailResponseDTO>) => {
        if (response.status === 200) {
          this.patient = response.data;
          this.populateForm();
        } else {
          this.error = response.message || 'Failed to load patient details';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading patient:', err);
        this.error = 'Failed to load patient details. Please try again.';
        this.loading = false;
      }
    });
  }

  private populateForm(): void {
    if (this.patient) {
      this.patientForm.patchValue({
        full_Name: this.patient.full_Name || '',
        gender: this.patient.gender || '',
        date_of_birth: this.formatDateForInput(this.patient.date_Of_Birth),
        id_Number: this.patient.id_number || '',
        phone_Number: this.patient.phone_Number || '',
        email: this.patient.email || '',
        address: this.patient.address || '',
        blood_type: this.patient.blood_type || '',
        allergies: this.patient.allergies || '',
        marital_status: this.patient.marital_status || '',
        occupation: this.patient.occupation || ''
      });
    }
  }

  private formatDateForInput(dateString: string | undefined): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.saving = true;
      this.error = null;

      const formData = this.patientForm.value;
      this.patientService.updatePatient(this.patientId, formData).subscribe({
        next: (response) => {
          if (response.status === 200) {
            alert('Cập nhật thông tin bệnh nhân thành công!');
            this.router.navigate(['/patient', this.patientId]);
          } else {
            this.error = response.message || 'Có lỗi xảy ra khi cập nhật thông tin';
          }
          this.saving = false;
        },
        error: (err) => {
          console.error('Error updating patient:', err);
          this.error = 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.';
          this.saving = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.patientForm.dirty) {
      if (confirm('Bạn có những thay đổi chưa được lưu. Bạn có chắc chắn muốn hủy?')) {
        this.router.navigate(['/patient', this.patientId]);
      }
    } else {
      this.router.navigate(['/patient', this.patientId]);
    }
  }

  // Getter methods for form validation
  get fullName() { return this.patientForm.get('full_Name'); }
  get gender() { return this.patientForm.get('gender'); }
  get dateOfBirth() { return this.patientForm.get('date_of_birth'); }
  get phoneNumber() { return this.patientForm.get('phone_Number'); }
  get email() { return this.patientForm.get('email'); }
  get address() { return this.patientForm.get('address'); }
}