import { Component } from '@angular/core';
import { DoctorDetailComponent } from "../doctor/doctor-detail/doctor-detail.component";
import { DoctorMedicalRecordListComponent } from "../medicalrecord/doctor-medical-record-list/doctor-medical-record-list.component";
import { MedicalrecordDetailComponent } from "../medicalrecord/medicalrecord-detail/medicalrecord-detail.component";
import { HomeHeaderComponent } from "../shared/home-header/home-header.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorInfoComponent } from './doctor-info/doctor-info.component';

@Component({
  selector: 'app-doctor-page',
  imports: [CommonModule, 
    RouterLink ,
    DoctorDetailComponent,
    DoctorMedicalRecordListComponent,
    MedicalrecordDetailComponent, 
    HomeHeaderComponent,
    DoctorInfoComponent
    ],
  templateUrl: './doctor-page.component.html',
  styleUrl: './doctor-page.component.css'
})
export class DoctorPageComponent {
  activeTab: string = 'medical-records'; // Giữ nguyên default

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
