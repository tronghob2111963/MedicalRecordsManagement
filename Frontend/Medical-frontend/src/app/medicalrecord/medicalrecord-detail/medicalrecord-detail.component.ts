import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalrecordService, MedicalRecordDetailResponse, ResponseData } from '../../services/medicalrecord.service';

@Component({
  selector: 'app-medicalrecord-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicalrecord-detail.component.html',
  styleUrl: './medicalrecord-detail.component.css'
})
export class MedicalrecordDetailComponent implements OnInit {
  @Input() recordId?: number;
  
  medicalRecord: MedicalRecordDetailResponse | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private medicalRecordService: MedicalrecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get record ID from route params if not provided as input
    if (!this.recordId) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.recordId = +id;
      }
    }

    if (this.recordId) {
      this.loadMedicalRecord();
    } else {
      this.error = 'Không tìm thấy ID bệnh án';
    }
  }

  loadMedicalRecord(): void {
   const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.loading = true;
      this.error = null;

      this.medicalRecordService.getMedicalRecordById(+id).subscribe({
        next: (response: ResponseData<MedicalRecordDetailResponse>) => {
          if (response.status === 200 && response.data) {
            this.medicalRecord = response.data;
          } else {
            this.error = response.message || 'Failed to load medical record details';
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading medical record details: ' + (err.message || 'Unknown error');
          this.loading = false;
        }
      });
    } else {
      this.error = 'Invalid medical record ID';
    }
  }

  // This method should be added to the service, but I'm including it here for completeness


  onEdit(): void {
    if (this.recordId) {
      this.router.navigate(['/update-medical-record', this.recordId]);
    }
  }

  onDelete(): void {
    if (this.recordId && confirm('Bạn có chắc chắn muốn xóa bệnh án này?')) {
      this.loading = true;
      this.medicalRecordService.deleteMedicalRecord(this.recordId).subscribe({
        next: (response) => {
          if (this.medicalRecordService.isSuccessResponse(response)) {
            alert('Xóa bệnh án thành công');
            this.router.navigate(['/admin']);
          } else {
            this.error = this.medicalRecordService.getErrorMessage(response);
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Có lỗi xảy ra khi xóa bệnh án';
          this.loading = false;
          console.error('Error deleting medical record:', error);
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/admin']);
  }

  viewDoctorDetail(doctorId: number | undefined): void {
    if (doctorId) {
      this.router.navigate(['/doctor-detail', doctorId]);
    }
  }


  getStatusText(status: string): string {
    switch (status) {
      case 'Under_treatment':
        return 'Đang điều trị';
      case 'Completed':
        return 'Hoàn thành';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Under_treatment':
        return 'status-under-treatment';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}