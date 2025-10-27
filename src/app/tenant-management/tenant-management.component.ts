import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import axios from 'axios';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApartmentService } from '../app.service';

@Component({
  selector: 'app-tenant-management',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      CommonModule,
      ReactiveFormsModule,
      HttpClientModule,
      RouterModule,
  ],
  templateUrl: './tenant-management.component.html',
  styleUrls: ['./tenant-management.component.css'],
  providers: [
      ApartmentService
  ]
})
export class TenantManagementComponent implements OnInit {
  selectedOption: string = 'viewTenants';
  tenantForm: FormGroup;
  updateForm: FormGroup;
  tenants: any[] = [];
  filteredTenants: any[] = [];
  selectedTenant: any;
  searchQuery: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean | undefined;

  constructor(private fb: FormBuilder, private apartmentService: ApartmentService) {
    this.tenantForm = this.fb.group({
      tenantId: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      apartmentNumber: ['', Validators.required],
      leaseStartDate: ['', Validators.required],
      leaseEndDate: ['', Validators.required],
    });

    this.updateForm = this.fb.group({
      tenantId: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      apartmentNumber: ['', Validators.required],
      leaseStartDate: ['', Validators.required],
      leaseEndDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.isLoading = true;
    this.apartmentService.getTenant().subscribe({
      next: (tenants: any[]) => {
        this.tenants = tenants;
        this.filteredTenants = [...tenants];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load apartments';
        console.error(err);
        this.isLoading = false;
      }
    });
    this.apartmentService.loadApartments();
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.successMessage = '';
    this.errorMessage = '';
  }

  filterTenants() {
    const query = this.searchQuery.trim();  
    console.log('Search Query:', query);    

    if (query === '') {
        this.filteredTenants = this.tenants;
    } else {
        this.apartmentService.searchTenants(query).subscribe({
            next: (data) => {
                console.log('Filtered Tenants:', data);  
                if (data.length > 0) {
                    this.filteredTenants = data;  
                } else {
                    this.filteredTenants = [];  
                    this.errorMessage = 'Tenant not found';  
                }
            },
            error: (err) => {
                console.error('Error searching tenant:', err);
                this.errorMessage = 'Error searching tenant';  
            }
        });
    }
}


  resetSearch(): void {
    this.searchQuery = '';
    this.loadTenants();  
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.tenantForm.valid) {
      const formData = this.tenantForm.value;
      this.apartmentService.createTenant(formData).subscribe({
        next: () => {
          this.successMessage = 'Apartment created successfully!';
          this.tenantForm.reset();
          this.apartmentService.refreshTenant();
          setTimeout(() => { this.successMessage = ''; }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error creating tenant. Please try again.';
          console.error(err);
          setTimeout(() => { this.errorMessage = ''; }, 3000);
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
    }
  }

  onUpdate() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.updateForm.valid && this.selectedTenant) {
      const formData = this.updateForm.value;
      this.apartmentService.updateApartment(this.selectedTenant.tenantId, formData).subscribe({
        next: () => {
          this.successMessage = 'tenant updated successfully!';
          this.selectedTenant = null;
          this.apartmentService.refreshTenant();
          setTimeout(() => { this.successMessage = ''; }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error updating tenant. Please try again.';
          console.error(err);
          setTimeout(() => { this.errorMessage = ''; }, 3000);
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
    }
  }

  getAllTenants() {
    this.apartmentService.getTenant().subscribe({
      next: (tenants) => {
        this.tenants = this.tenants;
        this.filteredTenants = tenants; 
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching tenants';
        console.error(err);
      }
    });
  }


  deleteTenant(tenant: any) {
    if (confirm('Are you sure you want to delete this apartment?')) {
      this.apartmentService.deleteTenant(tenant.tenantId).subscribe({
        next: () => {
          this.successMessage = 'tenant deleted successfully!';
          this.apartmentService.refreshTenant();
          setTimeout(() => { this.successMessage = ''; }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error deleting tenant. Please try again.';
          console.error(err);
          setTimeout(() => { this.errorMessage = ''; }, 3000);
        }
      });
    }
  }

  selectTenantToUpdate(tenant: any) {
    this.selectedTenant = tenant;
    this.updateForm.patchValue({
      tenantId: tenant.tenantId,
      fullName: tenant.fullName,
      email: tenant.email,
      phone: tenant.phone,
      apartmentNumber: tenant.apartmentNumber,
      leaseStartDate: tenant.leaseStartDate,
      leaseEndDate: tenant.leaseEndDate,
    });
  }

  onClearSearch() {
    this.searchQuery = '';
    this.selectedTenant = null;
    this.updateForm.reset();
    this.errorMessage = '';
  }
}
