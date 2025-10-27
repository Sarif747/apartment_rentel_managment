import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApartmentService } from '../app.service';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-apartment-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  
  templateUrl: './apartment-management.component.html',
  styleUrls: ['./apartment-management.component.css'],
  providers: [
    ApartmentService
  ]
})
export class ApartmentManagementComponent implements OnInit {
  selectedOption: string = 'viewApartments';
  apartmentForm: FormGroup;
  updateForm: FormGroup;
  apartments: any[] = [];
  filteredApartments: any[] = [];
  selectedApartment: any;
  searchQuery: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService
  ) {
    this.apartmentForm = this.fb.group({
      apartmentNumber: ['', Validators.required],
      address: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      bedrooms: ['', [Validators.required, Validators.min(1)]],
      bathrooms: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      squareFootage: ['', [Validators.required, Validators.min(0)]],
      pool: [false],
      gym: [false],
      parking: [false],
    });

    this.updateForm = this.fb.group({
      apartmentNumber: ['', Validators.required],
      address: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      bedrooms: ['', [Validators.required, Validators.min(1)]],
      bathrooms: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      squareFootage: ['', [Validators.required, Validators.min(0)]],
      pool: [false],
      gym: [false],
      parking: [false],
     
    });
  }

  // ngOnInit() {
  //   this.apartmentService.getApartments().subscribe((data) => {
  //     this.apartments = data;
  //   });
  //   this.apartmentService.loadApartments(); 
  // }

  ngOnInit() {
    this.loadApartments();
  }

  getSelectedAmenities(formGroup: FormGroup): string {
    const amenitiesArray = [];
    if (formGroup.get('pool')?.value) amenitiesArray.push('Pool');
    if (formGroup.get('gym')?.value) amenitiesArray.push('Gym');
    if (formGroup.get('parking')?.value) amenitiesArray.push('Parking');
    return amenitiesArray.join(', ');
  }

  loadApartments() {
    this.isLoading = true;
    this.apartmentService.apartments$.subscribe({
      next: (apartments) => {
        this.apartments = apartments;
        this.filteredApartments = [...apartments];
        this.isLoading = false;
      },
      error: (err) => {
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

  filterApartments() {
    const query = this.searchQuery.trim();  
    console.log('Search Query:', query);   

    if (query === '') {
        this.filteredApartments = this.apartments;
    } else {
        this.apartmentService.searchApartments(query).subscribe({
            next: (data) => {
                console.log('Filtered Apartments:', data); 
                if (data.length > 0) {
                    this.filteredApartments = data;  
                } else {
                    this.filteredApartments = [];  
                    this.errorMessage = 'Apartment not found';  
                }
            },
            error: (err) => {
                console.error('Error searching apartments:', err);
                this.errorMessage = 'Error searching apartments';  
            }
        });
    }
}


  resetSearch(): void {
    this.searchQuery = '';
    this.loadApartments();  
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.apartmentForm.valid) {
      const formData = this.apartmentForm.value;
      formData.amenities = this.getSelectedAmenities(this.apartmentForm)
      this.apartmentService.createApartment(formData).subscribe({
        next: () => {
          this.successMessage = 'Apartment created successfully!';
          this.apartmentForm.reset();
          this.apartmentService.refreshApartments();
          setTimeout(() => { this.successMessage = ''; }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error creating apartment. Please try again.';
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

    if (this.updateForm.valid && this.selectedApartment) {
      const formData = this.updateForm.value;
      formData.amenities = this.getSelectedAmenities(this.updateForm);
      this.apartmentService.updateApartment(this.selectedApartment.apartmentNumber, formData).subscribe({
        next: () => {
          this.successMessage = 'Apartment updated successfully!';
          this.selectedApartment = null;
          this.apartmentService.refreshApartments();
          setTimeout(() => { this.successMessage = ''; }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error updating apartment. Please try again.';
          console.error(err);
          setTimeout(() => { this.errorMessage = ''; }, 3000);
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
    }
  }

   getAllApartments() {
    this.apartmentService.getApartments().subscribe({
      next: (apartments) => {
        this.apartments = apartments;
        this.filteredApartments = apartments; 
      },
      error: (err) => {
        this.errorMessage = 'Error fetching apartments';
        console.error(err);
      }
    });
  }

  deleteApartment(apartment: any) {
    if (confirm('Are you sure you want to delete this apartment?')) {
      this.apartmentService.deleteApartment(apartment.apartmentNumber).subscribe({
        next: () => {
          this.successMessage = 'Apartment deleted successfully!';
          this.apartmentService.refreshApartments();
          setTimeout(() => { this.successMessage = ''; }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error deleting apartment. Please try again.';
          console.error(err);
          setTimeout(() => { this.errorMessage = ''; }, 3000);
        }
      });
    }
  }

  selectApartmentToUpdate(apartment: any) {
    this.selectedApartment = apartment;
    this.updateForm.patchValue({
      ...apartment,
      pool: apartment.amenities.includes('Pool'),
      gym: apartment.amenities.includes('Gym'),
      parking: apartment.amenities.includes('Parking')
    });
  }

  onClearSearch() {
    this.searchQuery = '';
    this.selectedApartment = null;
    this.updateForm.reset();
    this.errorMessage = '';
  }

}