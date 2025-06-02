import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreatePatientComponent } from "./patient/create-patient/create-patient.component";
import { HomeComponent } from "./home/home.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreatePatientComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Medical-frontend';
}
