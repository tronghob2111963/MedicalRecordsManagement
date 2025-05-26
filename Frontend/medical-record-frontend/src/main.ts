import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './app/home/home.component';

bootstrapApplication(HomeComponent)
  .catch((err) => console.error(err));
