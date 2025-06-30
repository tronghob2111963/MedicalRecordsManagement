import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Thêm CommonModule
import { HeaderComponent } from "../shared/header/header.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { HomeHeaderComponent } from '../shared/home-header/home-header.component';
import { DoctorComponent } from "../doctor/doctor.component";
import { PatientComponent } from '../patient/patient.component';
import { MedicalrecordComponent } from '../medicalrecord/medicalrecord.component';
import { UserComponent } from "../user/user.component";
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin', // Đổi từ 'app-home' thành 'app-admin'
  standalone: true,
  imports: [
    CommonModule, // Thêm CommonModule vào imports
    RouterOutlet,
    HomeHeaderComponent,
    RouterLink,
    DoctorComponent,
    PatientComponent,
    MedicalrecordComponent,
    UserComponent,
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  activeTab: string = 'patient'; // Giữ nguyên default

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
