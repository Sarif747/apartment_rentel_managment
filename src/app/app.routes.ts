import { Routes } from '@angular/router';
import { ApartmentManagementComponent } from './apartment-management/apartment-management.component';
import { TenantManagementComponent } from './tenant-management/tenant-management.component';
import { LeaseManagementComponent } from './lease-management/lease-management.component';
import { MaintenanceRequestComponent } from './maintenance-request/maintenance-request.component';
import { PaymentManagementComponent } from './payment-management/payment-management.component';
import { WeatherInformationComponent } from './weather-information/weather-information.component';


export const routes: Routes = [
  { path: 'apartments', component: ApartmentManagementComponent },
  { path: 'tenants', component: TenantManagementComponent },
  { path: 'leases', component: LeaseManagementComponent },
  { path: 'maintenance', component: MaintenanceRequestComponent },
  { path: 'payments', component: PaymentManagementComponent },
  { path: 'weather', component: WeatherInformationComponent },
  { path: '', redirectTo: '/apartments', pathMatch: 'full' }
];
