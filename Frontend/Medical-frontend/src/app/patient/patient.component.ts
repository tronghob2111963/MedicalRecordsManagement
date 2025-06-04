import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService, PatientListResponseDTO, ResponseData } from '../services/patient.service';

@Component({
  selector: 'app-patient',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit {

  // Danh sách bệnh nhân
  patients: PatientListResponseDTO[] = [];
  filteredPatients: PatientListResponseDTO[] = [];

  // Loading state
  isLoading: boolean = false;

  // Error handling
  errorMessage: string = '';

  // Search và Filter
  searchTerm: string = '';
  selectedStatus: string = '';

  // Pagination
  currentPage: number = 1;
  patientsPerPage: number = 6;
  totalPatients: number = 0;

  // Statistics
  totalPatientsCount: number = 248;
Math: any;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  /**
   * Load danh sách bệnh nhân từ API
   */
  loadPatients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.patientService.getAllPatients().subscribe({
      next: (response: ResponseData<PatientListResponseDTO[]>) => {
        this.isLoading = false;
        if (response.code === 200 && response.data) {
          this.patients = response.data;
          this.filteredPatients = [...this.patients];
          this.totalPatients = this.patients.length;
          this.totalPatientsCount = this.patients.length;
        } else {
          this.errorMessage = response.message || 'Không thể tải danh sách bệnh nhân';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = this.patientService.handleError(error);
        console.error('Error loading patients:', error);
      }
    });
  }

  /**
   * Tìm kiếm bệnh nhân
   */
  onSearch(): void {
    return  this.loadPatients();
  }

  /**
   * Filter dữ liệu local
   */
  private filterLocalData(): void {
    this.filteredPatients = this.patients.filter(patient => {
      const matchesSearch = !this.searchTerm.trim() ||
        patient.full_Name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.phone_Number.includes(this.searchTerm);

      // Note: Status filter cần được implement ở backend hoặc thêm field status
      const matchesStatus = !this.selectedStatus; // Tạm thời bỏ qua status filter

      return matchesSearch && matchesStatus;
    });

    this.currentPage = 1; // Reset về trang đầu
  }

  /**
   * Reset search và filter
   */
  onResetFilter(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.filteredPatients = [...this.patients];
    this.currentPage = 1;
  }

  /**
   * Tính tuổi từ ngày sinh
   */
  // calculateAge(dateOfBirth: string): number {
  //  return this.patientService.calculateAge(dateOfBirth);
  // }

  // /**
  //  * Tạo avatar từ tên
  //  */
  // generateAvatar(fullName: string): string {
  //   return this.patientService.generateAvatar(fullName);
  // }

  /**
   * Format ngày sinh
   */
  formatDate(dateStr: string): string {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString('vi-VN');
  }

  /**
   * Lấy danh sách bệnh nhân cho trang hiện tại
   */
  getCurrentPagePatients(): PatientListResponseDTO[] {
    const startIndex = (this.currentPage - 1) * this.patientsPerPage;
    const endIndex = startIndex + this.patientsPerPage;
    return this.filteredPatients.slice(startIndex, endIndex);
  }

  /**
   * Tính tổng số trang
   */
  getTotalPages(): number {
    return Math.ceil(this.filteredPatients.length / this.patientsPerPage);
  }

  /**
   * Chuyển trang
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  /**
   * Trang trước
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Trang sau
   */
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  /**
   * Lấy array số trang để hiển thị
   */
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Xử lý xóa bệnh nhân
   */
  onDeletePatient(patientName: string): void {
    if (confirm(`Bạn có chắc chắn muốn xóa bệnh nhân "${patientName}"?`)) {
      // TODO: Implement delete functionality
      // Cần có ID để xóa, nhưng PatientListResponseDTO không có ID
      // Có thể cần thêm ID vào DTO hoặc tìm cách khác
      console.log('Delete patient:', patientName);
    }
  }

  /**
   * Xuất Excel
   */
  onExportExcel(): void {
    // TODO: Implement export Excel functionality
    console.log('Export to Excel');
  }

  /**
   * Refresh danh sách
   */
  onRefresh(): void {
    this.loadPatients();
  }
}


