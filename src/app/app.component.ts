import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routes } from './app.routes';  // Correct the import path
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // <-- Import CommonModule
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'apartment-rental-management-system';
}
