import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicalrecordService, MedicalRecordResponse, PageResponse } from '../../services/medicalrecord.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-doctor-medical-record-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-medical-record-list.component.html',
  styleUrl: './doctor-medical-record-list.component.css'
})
export class DoctorMedicalRecordListComponent implements OnInit {
  medicalRecords: MedicalRecordResponse[] = [];
  doctorId: number | null = null;
  doctor_Name: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  // Sorting properties
  sortBy: string = 'doctor_id:asc';
  sortOptions = [
    { value: 'doctor_id:asc', label: 'Doctor ID (Tăng dần)' },
    { value: 'doctor_id:desc', label: 'Doctor ID (Giảm dần)' },
    { value: 'patient_Name:asc', label: 'Tên bệnh nhân (A-Z)' },
    { value: 'patient_Name:desc', label: 'Tên bệnh nhân (Z-A)' },
    { value: 'status:asc', label: 'Trạng thái (A-Z)' },
    { value: 'status:desc', label: 'Trạng thái (Z-A)' }
  ];

  // Loading and error states
  isLoading: boolean = false;
  errorMessage: string = '';

  // Page size options
  pageSizeOptions: number[] = [5, 10, 20, 50];

  constructor(
    private medicalRecordService: MedicalrecordService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    // Lấy thông tin doctor từ localStorage
    this.doctorId = this.authService.getDoctorId();
    this.doctor_Name = this.authService.getUsername();

    if (!this.doctorId) {
      this.errorMessage = 'Không tìm thấy thông tin bác sĩ. Vui lòng đăng nhập lại.';
      return;
    }

    // Load danh sách medical records
    this.loadMedicalRecords();
  }

  loadMedicalRecords(): void {
    if (!this.doctorId) {
      this.errorMessage = 'Doctor ID không hợp lệ';
      return;
  }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('Đang tải hồ sơ bệnh án cho Doctor ID:', this.doctorId);
    console.log('Tham số yêu cầu:', {
      doctorId: this.doctorId,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy
    });

    this.medicalRecordService.getMedicalRecordsByDoctorId(
      this.doctorId,
      this.currentPage,
      this.pageSize,
      this.sortBy
    ).subscribe({
      next: (response) => {
        console.log('Phản hồi API đầy đủ:', response);
        this.isLoading = false;

        if (this.medicalRecordService.isSuccessResponse(response)) {
          const pageData = this.medicalRecordService.extractData(response);
          console.log('Dữ liệu trang được trích xuất:', pageData);

          if (pageData && pageData.items) {
            this.medicalRecords = pageData.items; // Đảm bảo gán đúng items
            this.totalElements = pageData.totalElements || 0;
            this.totalPages = pageData.totalPages || 0;
            this.currentPage = pageData.pageNo || 1;
          } else {
            console.log('Không tìm thấy items trong dữ liệu trang');
            this.medicalRecords = [];
            this.totalElements = 0;
            this.totalPages = 0;
          }
        } else {
          console.log('Phản hồi không thành công:', response);
          this.errorMessage = this.medicalRecordService.getErrorMessage(response) || 'Không tải được dữ liệu';
        }
      },
      error: (error) => {
        console.error('Lỗi API:', error);
        this.isLoading = false;
        this.errorMessage = error.message || 'Có lỗi xảy ra khi tải danh sách hồ sơ bệnh án';
      }
    });
  }

  // Pagination methods
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadMedicalRecords();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1; // Reset về trang đầu khi thay đổi page size
    this.loadMedicalRecords();
  }

  // Sorting methods
  onSortChange(): void {
    this.currentPage = 1; // Reset về trang đầu khi thay đổi sort
    this.loadMedicalRecords();
  }

  // Utility methods
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    // Điều chỉnh startPage nếu cần
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'under_treatment':
        return 'status-under-treatment';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getStatusDisplay(status: string): string {
    switch (status?.toLowerCase()) {
      case 'under_treatment':
        return 'Đang điều trị';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status || 'Không xác định';
    }
  }

  // Refresh data
  refreshData(): void {
    this.currentPage = 1;
    this.loadMedicalRecords();
  }

  // Debug method to check API response structure
  debugApiResponse(): void {
    if (!this.doctorId) return;

    console.log('=== DEBUG API CALL ===');
    console.log('Doctor ID:', this.doctorId);
    console.log('Auth token:', this.authService.getAccessToken()?.substring(0, 20) + '...');

    // Make a direct HTTP call to see raw response
    this.medicalRecordService.getMedicalRecordsByDoctorId(this.doctorId, 1, 10, 'doctor_id:asc')
      .subscribe({
        next: (response) => {
          console.log('Raw API Response:', JSON.stringify(response, null, 2));
        },
        error: (error) => {
          console.log('API Error:', error);
        }
      });
  }

  // Check if has previous/next page
  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  // TrackBy function for better performance
  trackByRecordId = (index: number, record: MedicalRecordResponse): number => {
    return record.id;
  }

  // Action methods
  viewMedicalDetail(id: number): void {
    this.router.navigate(['/medical-record', id]);
  }
  editMedicalRecord(id: number): void {
    this.router.navigate(['/update-medical-record', id]);
  }
}