import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService, DoctorResponseDTO, ResponseData } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-detail.component.html',
  styleUrl: './doctor-detail.component.css'
})
export class DoctorDetailComponent implements OnInit {
  doctor: DoctorResponseDTO | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.loadDoctorDetails();
  }

   loadDoctorDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.loading = true;
      this.error = null;

      this.doctorService.getDoctorById(+id).subscribe({
        next: (response: ResponseData<DoctorResponseDTO>) => {
          if (response.status === 200 && response.data) {
            this.doctor = response.data;
          } else {
            this.error = response.message || 'Failed to load doctor details';
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading doctor details: ' + (err.message || 'Unknown error');
          this.loading = false;
        }
      });
    } else {
      this.error = 'Invalid doctor ID';
    }
  }
  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getStatusText(status: string): string {
    return status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động';
  }

  goBack(): void {
    window.history.back();
  }
}