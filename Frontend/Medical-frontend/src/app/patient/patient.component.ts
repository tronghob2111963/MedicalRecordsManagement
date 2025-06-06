import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService, PatientListResponseDTO, ResponseData, PageResponse } from '../services/patient.service';
import { HeaderComponent } from '../shared/header/header.component';
import { HomeHeaderComponent } from '../shared/home-header/home-header.component';

@Component({
  selector: 'app-patient',
  imports: [RouterLink, CommonModule, FormsModule ,HomeHeaderComponent],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit {
[x: string]: any;

  // Danh sách bệnh nhân
  patients: PatientListResponseDTO[] = [];

  // Phân trang
  currentPage = 1;
  pageSize = 6; // 6 bệnh nhân mỗi trang như trong template
  totalElements = 0;
  totalPages = 0;

  // Sắp xếp
  sortBy = 'ID:asc';

  // Loading state
  isLoading = false;

  // Error handling
  errorMessage = '';

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  // Load danh sách bệnh nhân
  loadPatients(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.patientService.getAllPatients(this.currentPage, this.pageSize, this.sortBy)
      .subscribe({
        next: (response: ResponseData<PageResponse<PatientListResponseDTO>>) => {
          if (response.status === 200) {
            this.patients = response.data.items;
            this.currentPage = response.data.pageNo;
            this.pageSize = response.data.pageSize;
            this.totalElements = response.data.totalElements;
            this.totalPages = response.data.totalPages;
          } else {
            this.errorMessage = response.message || 'Có lỗi xảy ra khi tải danh sách bệnh nhân';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading patients:', error);
          this.errorMessage = 'Không thể tải danh sách bệnh nhân. Vui lòng thử lại.';
          this.isLoading = false;
        }
      });
  }

  // Chuyển trang
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadPatients();
    }
  }

  // Trang trước
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPatients();
    }
  }

  // Trang sau
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPatients();
    }
  }

  // Xóa bệnh nhân
  deletePatient(patientId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
      this.patientService.deletePatient(patientId).subscribe({
        next: (response) => {
          if (response.status === 200) {
            alert('Xóa bệnh nhân thành công!');
            this.loadPatients(); // Reload danh sách
          } else {
            alert('Có lỗi xảy ra khi xóa bệnh nhân');
          }
        },
        error: (error) => {
          console.error('Error deleting patient:', error);
          alert('Không thể xóa bệnh nhân. Vui lòng thử lại.');
        }
      });
    }
  }

  // Tính tuổi từ ngày sinh
  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  // Lấy initials cho avatar
  getInitials(fullName: string): string {
    if (!fullName) return 'N/A';

    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }

  // Lấy danh sách trang để hiển thị
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Format ngày sinh
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  // Refresh danh sách
  refreshPatients(): void {
    this.currentPage = 1;
    this.loadPatients();
  }
}