import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PatientComponent } from './patient/patient.component';
import { CreatePatientComponent } from './patient/create-patient/create-patient.component';
import { PatientDetailComponent } from './patient/patient-detail/patient-detail.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'patient', component: PatientComponent},
    {path: 'create-patient', component: CreatePatientComponent},
    {path: 'patient-detail/:id', component: PatientDetailComponent},
];
