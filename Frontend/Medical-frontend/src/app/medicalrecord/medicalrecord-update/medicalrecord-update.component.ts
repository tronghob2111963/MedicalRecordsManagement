import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  MedicalrecordService,
  MedicalRecordRequestDTO,
  MedicalRecordDetailResponse,
  ResponseData
} from '../../services/medicalrecord.service';

@Component({
  selector: 'app-medicalrecord-update',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './medicalrecord-update.component.html',
  styleUrl: './medicalrecord-update.component.css'
})
export class MedicalrecordUpdateComponent implements OnInit {
  // Form data
  medicalRecord: MedicalRecordRequestDTO = {
    patient_id: 0,
    doctor_id: 0,
    diagnosis: '',
    treatment: '',
    visit_date: '',
    note: '',
    status: 'Under_treatment'
  };

  // Current medical record details
  currentRecord: MedicalRecordDetailResponse | null = null;

  // Component state
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  recordId: number = 0;

  // Status options
  statusOptions = [
    { value: 'Under_treatment', label: 'Đang điều trị' },
    { value: 'Completed', label: 'Hoàn thành' },
    { value: 'Cancelled', label: 'Đã hủy' }
  ];

  constructor(
    private medicalRecordService: MedicalrecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get record ID from route params
    this.route.params.subscribe(params => {
      this.recordId = +params['id'];
      if (this.recordId) {
        this.loadMedicalRecord();
      } else {
        this.errorMessage = 'ID hồ sơ không hợp lệ';
      }
    });
  }

  /**
   * Load medical record details
   */
  loadMedicalRecord(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.medicalRecordService.getMedicalRecordById(this.recordId)
      .subscribe({
        next: (response: ResponseData<MedicalRecordDetailResponse>) => {
          if (response.status === 200 && response.data) {
            this.currentRecord = response.data;
            // Populate form with current data
            this.medicalRecord = {
              patient_id: this.currentRecord.patient_id, // You might need to adjust this based on your data structure
              doctor_id: this.currentRecord.doctor_id, // You might need to adjust this based on your data structure
              diagnosis: this.currentRecord.diagnosis,
              treatment: this.currentRecord.treatment,
              visit_date: this.currentRecord.visit_date,
              note: this.currentRecord.note,
              status: this.currentRecord.status
            };
          } else {
            this.errorMessage = response.message || 'Không thể tải thông tin hồ sơ';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading medical record:', error);
          this.errorMessage = 'Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.';
          this.isLoading = false;
        }
      });
  }

  /**
   * Update medical record
   */
  updateMedicalRecord(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.medicalRecordService.updateMedicalRecord(this.recordId, this.medicalRecord)
      .subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.successMessage = 'Cập nhật hồ sơ thành công!';
            // Reload the record to get updated data
            setTimeout(() => {
              this.loadMedicalRecord();
            }, 1000);
          } else {
            this.errorMessage = response.message || 'Có lỗi xảy ra khi cập nhật hồ sơ';
          }
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error updating medical record:', error);
          this.errorMessage = 'Không thể cập nhật hồ sơ. Vui lòng thử lại sau.';
          this.isSaving = false;
        }
      });
  }

  /**
   * Validate form
   */
  isFormValid(): boolean {
    if (!this.medicalRecord.patient_id || this.medicalRecord.patient_id <= 0) {
      this.errorMessage = 'ID bệnh nhân không hợp lệ';
      return false;
    }
    if (!this.medicalRecord.doctor_id || this.medicalRecord.doctor_id <= 0) {
      this.errorMessage = 'ID bác sĩ không hợp lệ';
      return false;
    }
    if (!this.medicalRecord.diagnosis.trim()) {
      this.errorMessage = 'Vui lòng nhập chẩn đoán';
      return false;
    }
    if (!this.medicalRecord.treatment.trim()) {
      this.errorMessage = 'Vui lòng nhập phương pháp điều trị';
      return false;
    }
    if (!this.medicalRecord.visit_date) {
      this.errorMessage = 'Vui lòng chọn ngày khám';
      return false;
    }
    return true;
  }

  /**
   * Reset form
   */
  resetForm(): void {
    this.loadMedicalRecord(); // Reload original data
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Navigate back to medical records list
   */
  goBack(): void {
    this.router.navigate(['/medical-records']);
  }

  /**
   * Get status label
   */
  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  /**
   * Format date for display
   */
  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  }
}