import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, DoctorResponseDTO, ResponseData } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-info.component.html',
  styleUrl: './doctor-info.component.css'
})
export class DoctorInfoComponent implements OnInit {
  doctorInfo: DoctorResponseDTO | null = null;
  loading = false;
  error: string | null = null;
  isEditing = false;
  
  // Form data for editing
  editForm: DoctorResponseDTO = {
    full_name: '',
    specialty: '',
    phone_number: '',
    email: '',
    license_Number: '',
    status: ''
  };

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctorInfo();
  }

  /**
   * Load doctor information
   * Giả sử bạn có cách lấy ID bác sĩ hiện tại (từ token, localStorage, etc.)
   * Ở đây tôi sẽ để một ví dụ, bạn cần thay đổi theo logic của mình
   */
  loadDoctorInfo(): void {
    this.loading = true;
    this.error = null;

    // TODO: Thay thế bằng cách lấy ID bác sĩ thực tế
    // Có thể từ token JWT, localStorage, hoặc từ authentication service
    const doctorId = this.getCurrentDoctorId();
    
    if (!doctorId) {
      this.error = 'Không thể xác định thông tin bác sĩ';
      this.loading = false;
      return;
    }

    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (response: ResponseData<DoctorResponseDTO>) => {
        if (response.status === 200) {
          this.doctorInfo = response.data;
          this.editForm = { ...response.data };
        } else {
          this.error = response.message || 'Không thể tải thông tin bác sĩ';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Có lỗi xảy ra khi tải thông tin bác sĩ';
        console.error('Error loading doctor info:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Get current doctor ID
   * TODO: Implement logic to get current doctor's ID
   * This could be from JWT token, localStorage, or authentication service
   */
  private getCurrentDoctorId(): number | null {
    // Ví dụ: lấy từ localStorage
    const doctorId = localStorage.getItem('doctorId');
    return doctorId ? parseInt(doctorId, 10) : null;

  }

  /**
   * Toggle edit mode
   */
  toggleEdit(): void {
    if (this.isEditing) {
      // Cancel editing - restore original data
      this.editForm = this.doctorInfo ? { ...this.doctorInfo } : {
        full_name: '',
        specialty: '',
        phone_number: '',
        email: '',
        license_Number: '',
        status: ''
      };
    }
    this.isEditing = !this.isEditing;
  }

  /**
   * Save doctor information
   */
  saveChanges(): void {
    if (!this.doctorInfo?.id) {
      this.error = 'Không thể cập nhật thông tin';
      return;
    }

    this.loading = true;
    this.error = null;

    // Convert to request DTO format
    const updateData = {
      full_name: this.editForm.full_name,
      specialty: this.editForm.specialty,
      phone_number: this.editForm.phone_number,
      email: this.editForm.email,
      licenseNumber: this.editForm.license_Number, // Note: different field name
      status: this.editForm.status
    };

    this.doctorService.updateDoctor(this.doctorInfo.id, updateData).subscribe({
      next: (response: ResponseData<DoctorResponseDTO>) => {
        if (response.status === 200) {
          this.doctorInfo = response.data;
          this.editForm = { ...response.data };
          this.isEditing = false;
          // Show success message (you can add a toast service here)
          console.log('Cập nhật thông tin thành công');
        } else {
          this.error = response.message || 'Không thể cập nhật thông tin';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Có lỗi xảy ra khi cập nhật thông tin';
        console.error('Error updating doctor info:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Refresh doctor information
   */
  refreshInfo(): void {
    this.loadDoctorInfo();
  }

  /**
   * Get status display text
   */
  getStatusDisplay(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      case 'pending':
        return 'Đang chờ duyệt';
      case 'suspended':
        return 'Tạm dừng';
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
      case 'suspended':
        return 'status-suspended';
      default:
        return 'status-unknown';
    }
  }
}