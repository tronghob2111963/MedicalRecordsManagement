import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PatientComponent } from './patient/patient.component';
import { CreatePatientComponent } from './patient/create-patient/create-patient.component';
import { PatientDetailComponent } from './patient/patient-detail/patient-detail.component';
import { PatientEditComponent } from './patient/patient-edit/patient-edit.component';
import { DoctorComponent } from './doctor/doctor.component';
import { DoctorDetailComponent } from './doctor/doctor-detail/doctor-detail.component';
import { DoctorEditComponent } from './doctor/doctor-edit/doctor-edit.component';
import { CreateDoctorComponent } from './doctor/create-doctor/create-doctor.component';
import { MedicalrecordComponent } from './medicalrecord/medicalrecord.component';
import { MedicalrecordDetailComponent } from './medicalrecord/medicalrecord-detail/medicalrecord-detail.component';
import { MedicalrecordUpdateComponent } from './medicalrecord/medicalrecord-update/medicalrecord-update.component';
import { MedicalrecordCreateComponent } from './medicalrecord/medicalrecord-create/medicalrecord-create.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'patient', component: PatientComponent},
    {path: 'create-patient', component: CreatePatientComponent},
    {path: 'patient-detail/:id', component: PatientDetailComponent},
    { path: 'update-patient/:id',component: PatientEditComponent},
    {path: 'doctor', component: DoctorComponent},
    {path: 'doctor-detail/:id', component: DoctorDetailComponent},
    {path: 'edit-doctor/:id', component: DoctorEditComponent},
    {path: 'create-doctor', component: CreateDoctorComponent},
    {path: 'medical-records', component: MedicalrecordComponent},
    {path: 'medical-record/:id', component: MedicalrecordDetailComponent},
    {path: 'update-medical-record/:id', component: MedicalrecordUpdateComponent},
    {path: 'create-medical-record', component: MedicalrecordCreateComponent},
];
