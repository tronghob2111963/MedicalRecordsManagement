import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientDetailResponseDTO, PatientService, ResponseData } from '../../services/patient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-detail',
  imports: [RouterLink,CommonModule],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css'
})
export class PatientDetailComponent  {
  patient: PatientDetailResponseDTO | null = null;
  loading = true;
  error: string | null = null;
  patientId: number = 0;
PatientDetailResponseDTO: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) { }

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

  loadPatientDetail(): void {
    this.loading = true;
    this.error = null;

    this.patientService.getPatientById(this.patientId).subscribe({
      next: (response: ResponseData<PatientDetailResponseDTO>) => {
        if (response.status === 200) {
          this.patient = response.data;
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

  onEdit(): void {
    if (this.patient?.id_number) {
      this.router.navigate(['/patients/edit', this.patient.id_number]);
    }
  }

  onDelete(): void {
    if (confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
      this.patientService.deletePatient(this.patientId).subscribe({
        next: (response) => {
          if (response.status === 200) {
            alert('Xóa bệnh nhân thành công!');
            this.router.navigate(['/patients']);
          } else {
            alert('Có lỗi xảy ra khi xóa bệnh nhân');
          }
        },
        error: (err) => {
          console.error('Error deleting patient:', err);
          alert('Có lỗi xảy ra khi xóa bệnh nhân');
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/patients']);
  }

  // Helper method to format date
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  }

  // Helper method to get age from date of birth
  calculateAge(dateOfBirth: string | undefined): number | null {
    if (!dateOfBirth) return null;
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  }

 
}
