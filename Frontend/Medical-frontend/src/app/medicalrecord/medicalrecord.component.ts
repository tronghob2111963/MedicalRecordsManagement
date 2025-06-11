import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalrecordService, MedicalRecordResponse, PageResponse, ResponseData } from '../services/medicalrecord.service';

@Component({
  selector: 'app-medicalrecord',
  imports: [CommonModule, FormsModule],
  templateUrl: './medicalrecord.component.html',
  styleUrl: './medicalrecord.component.css'
})
export class MedicalrecordComponent implements OnInit {
  // Data properties
  medicalRecords: MedicalRecordResponse[] = [];
  loading = false;
  error: string | null = null;

  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50];

  // Sorting properties
  sortBy = 'Id:asc';
  sortOptions = [
    { value: 'Id:asc', label: 'ID (Ascending)' },
    { value: 'Id:desc', label: 'ID (Descending)' },
    { value: 'patient_Name:asc', label: 'Patient Name (A-Z)' },
    { value: 'patient_Name:desc', label: 'Patient Name (Z-A)' },
    { value: 'doctor_Name:asc', label: 'Doctor Name (A-Z)' },
    { value: 'doctor_Name:desc', label: 'Doctor Name (Z-A)' },
    { value: 'status:asc', label: 'Status (A-Z)' },
    { value: 'status:desc', label: 'Status (Z-A)' }
  ];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private medicalRecordService: MedicalrecordService) {}

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  /**
   * Load medical records from backend
   */
  loadMedicalRecords(): void {
    this.isLoading = true;
    this.errorMessage = '';
   
       this.medicalRecordService.getAllMedicalRecords(this.currentPage, this.pageSize, this.sortBy)
         .subscribe({
           next: (response: ResponseData<PageResponse<MedicalRecordResponse>>) => {
             if (response.status === 200 && response.data) {
               this.medicalRecords = response.data.items;
               this.currentPage = response.data.pageNo;
               this.pageSize = response.data.pageSize;
               this.totalElements = response.data.totalElements;
               this.totalPages = response.data.totalPages;
             } else {
               this.errorMessage = response.message || 'Có lỗi xảy ra khi tải dữ liệu';
             }
             this.isLoading = false;
           },
           error: (error) => {
             console.error('Error loading doctors:', error);
             this.errorMessage = 'Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.';
             this.isLoading = false;
           }
         });
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadMedicalRecords();
    }
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(): void {
    this.currentPage = 1; // Reset to first page
    this.loadMedicalRecords();
  }

  /**
   * Handle sort change
   */
  onSortChange(): void {
    this.currentPage = 1; // Reset to first page
    this.loadMedicalRecords();
  }

  /**
   * Refresh data
   */
  refresh(): void {
    this.loadMedicalRecords();
  }

  /**
   * Get pages for pagination
   */
  getPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge-success';
      case 'under_treatment':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  /**
   * Format status display
   */
  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toUpperCase();
  }

  /**
   * Get range text for pagination
   */
  getRangeText(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalElements);
    return `${start}-${end} of ${this.totalElements}`;
  }
}

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-medicalrecord',
//   imports: [],
//   templateUrl: './medicalrecord.component.html',
//   styleUrl: './medicalrecord.component.css'
// })
// export class MedicalrecordComponent {

// }
