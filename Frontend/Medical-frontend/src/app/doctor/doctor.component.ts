import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, DoctorResponseDTO, PageResponse, ResponseData } from '../services/doctor.service';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Thêm RouterLink vào imports
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent implements OnInit {
  doctors: DoctorResponseDTO[] = [];

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  // Sorting properties
  sortBy: string = 'id:asc';
  sortOptions = [
    { value: 'id:asc', label: 'ID (Tăng dần)' },
    { value: 'id:desc', label: 'ID (Giảm dần)' },
    { value: 'full_name:asc', label: 'Tên (A-Z)' },
    { value: 'full_name:desc', label: 'Tên (Z-A)' },
    { value: 'specialty:asc', label: 'Chuyên khoa (A-Z)' },
    { value: 'specialty:desc', label: 'Chuyên khoa (Z-A)' }
  ];

  // Loading and error states
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private doctorService: DoctorService,
    private router: Router // Inject Router service
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  /**
   * Load doctors with current pagination and sorting settings
   */
  loadDoctors(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.doctorService.getAllDoctors(this.currentPage, this.pageSize, this.sortBy)
      .subscribe({
        next: (response: ResponseData<PageResponse<DoctorResponseDTO>>) => {
          if (response.status === 200 && response.data) {
            this.doctors = response.data.items;
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
  createNewDoctor(): void {
    this.router.navigate(['/create-doctor']); // Adjust route as needed
  }

  /**
   * Navigate to doctor detail page
   */
  viewDoctorDetail(doctorId: number | undefined): void {
    if (doctorId) {
      this.router.navigate(['/doctor-detail', doctorId]);
    }
  }

  /**
   * Navigate to edit doctor page (if you have one)
   */
  editDoctor(doctorId: number | undefined): void {
    if (doctorId) {
      // Implement navigation to edit page when you create it
      console.log('Edit doctor with ID:', doctorId);
      this.router.navigate(['/edit-doctor', doctorId]);
    }
  }

  /**
   * Delete doctor (implement confirmation dialog)
   */
  deleteDoctor(doctorId: number | undefined, doctorName: string): void {
    if (doctorId && confirm(`Bạn có chắc chắn muốn xóa bác sĩ "${doctorName}"?`)) {
      // Implement delete functionality
      console.log('Delete doctor with ID:', doctorId);
      this.doctorService.deleteDoctor(doctorId).subscribe({
        next: (response) => {
          if (response.status === 200) {
            alert('Xóa bác sĩ thành công!');
            this.loadDoctors(); // Reload danh sách
          } else {
            alert('Có lỗi xảy ra khi xóa bác sĩ');
          }
        },
        error: (error) => {
          console.error('Error deleting patient:', error);
          alert('Không thể xóa bác sĩ. Vui lòng thử lại.');
        }
      });
    }
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadDoctors();
    }
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(): void {
    this.currentPage = 1; // Reset to first page
    this.loadDoctors();
  }

  /**
   * Handle sort change
   */
  onSortChange(): void {
    this.currentPage = 1; // Reset to first page
    this.loadDoctors();
  }

  /**
   * Refresh the doctor list
   */
  refresh(): void {
    this.loadDoctors();
  }

  /**
   * Get array of page numbers for pagination
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Get status display text
   */
  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      case 'pending':
        return 'Chờ duyệt';
      default:
        return status || 'Không xác định';
    }
  }
  
  /**
   * Get status CSS class
   */
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-unknown';
    }
  }

  /**
   * Track by function for ngFor performance
   */
  trackByDoctorId(index: number, doctor: DoctorResponseDTO): number {
    return doctor.id || index;
  }

  /**
   * Helper method for Math.min in template
   */
  getDisplayedTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalElements);
  }
}
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { DoctorService, DoctorResponseDTO, PageResponse, ResponseData } from '../services/doctor.service';
// import { Observable } from 'rxjs';
// import { Router, RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-doctor',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './doctor.component.html',
//   styleUrl: './doctor.component.css'
// })
// export class DoctorComponent implements OnInit {
//   doctors: DoctorResponseDTO[] = [];

//   // Pagination properties
//   currentPage: number = 1;
//   pageSize: number = 10;
//   totalElements: number = 0;
//   totalPages: number = 0;

//   // Sorting properties
//   sortBy: string = 'id:asc';
//   sortOptions = [
//     { value: 'id:asc', label: 'ID (Tăng dần)' },
//     { value: 'id:desc', label: 'ID (Giảm dần)' },
//     { value: 'full_name:asc', label: 'Tên (A-Z)' },
//     { value: 'full_name:desc', label: 'Tên (Z-A)' },
//     { value: 'specialty:asc', label: 'Chuyên khoa (A-Z)' },
//     { value: 'specialty:desc', label: 'Chuyên khoa (Z-A)' }
//   ];

//   // Loading and error states
//   isLoading: boolean = false;
//   errorMessage: string = '';


//   constructor(private doctorService: DoctorService) {}

//   ngOnInit(): void {
//     this.loadDoctors();
//   }

//   /**
//    * Load doctors with current pagination and sorting settings
//    */
//   loadDoctors(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.doctorService.getAllDoctors(this.currentPage, this.pageSize, this.sortBy)
//       .subscribe({
//         next: (response: ResponseData<PageResponse<DoctorResponseDTO>>) => {
//           if (response.status === 200 && response.data) {
//             this.doctors = response.data.items;
//             this.currentPage = response.data.pageNo;
//             this.pageSize = response.data.pageSize;
//             this.totalElements = response.data.totalElements;
//             this.totalPages = response.data.totalPages;
//           } else {
//             this.errorMessage = response.message || 'Có lỗi xảy ra khi tải dữ liệu';
//           }
//           this.isLoading = false;
//         },
//         error: (error) => {
//           console.error('Error loading doctors:', error);
//           this.errorMessage = 'Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.';
//           this.isLoading = false;
//         }
//       });
//   }

//   /**
//    * Handle page change
//    */
//   onPageChange(page: number): void {
//     if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
//       this.currentPage = page;
//       this.loadDoctors();
//     }
//   }

//   /**
//    * Handle page size change
//    */
//   onPageSizeChange(): void {
//     this.currentPage = 1; // Reset to first page
//     this.loadDoctors();
//   }

//   /**
//    * Handle sort change
//    */
//   onSortChange(): void {
//     this.currentPage = 1; // Reset to first page
//     this.loadDoctors();
//   }

//   /**
//    * Refresh the doctor list
//    */
//   refresh(): void {
//     this.loadDoctors();
//   }

//   /**
//    * Get array of page numbers for pagination
//    */
//   getPageNumbers(): number[] {
//     const pages: number[] = [];
//     const startPage = Math.max(1, this.currentPage - 2);
//     const endPage = Math.min(this.totalPages, this.currentPage + 2);

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     return pages;
//   }

//   /**
//    * Get status display text
//    */
//   getStatusText(status: string): string {
//     switch (status?.toLowerCase()) {
//       case 'active':
//         return 'Hoạt động';
//       case 'inactive':
//         return 'Không hoạt động';
//       case 'pending':
//         return 'Chờ duyệt';
//       default:
//         return status || 'Không xác định';
//     }
//   }
  
//   /**
//    * Get status CSS class
//    */
//   getStatusClass(status: string): string {
//     switch (status?.toLowerCase()) {
//       case 'active':
//         return 'status-active';
//       case 'inactive':
//         return 'status-inactive';
//       case 'pending':
//         return 'status-pending';
//       default:
//         return 'status-unknown';
//     }
//   }

//   /**
//    * Track by function for ngFor performance
//    */
//   trackByDoctorId(index: number, doctor: DoctorResponseDTO): number {
//     return doctor.id || index;
//   }

//   /**
//    * Helper method for Math.min in template
//    */
//   getDisplayedTo(): number {
//     return Math.min(this.currentPage * this.pageSize, this.totalElements);
//   }


// }