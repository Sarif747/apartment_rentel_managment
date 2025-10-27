import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ApartmentService } from '../app.service';


interface Lease {
  leaseNumber: string;
  apartmentNumber: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  leaseterms: String;
  specialTerms: string;
}

@Component({
  selector: 'app-lease-management',
  standalone: true,
  imports: [
        CommonModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
  ],
  templateUrl: './lease-management.component.html',
  styleUrls: ['./lease-management.component.css'],
  providers: [
        ApartmentService
  ]
})
export class LeaseManagementComponent implements OnInit {

  activeView: 'create' | 'view' | 'update' | 'delete' = 'view';
  

  leases: Lease[] = [];
  

  newLease: Partial<Lease> = this.initializeNewLease();
  selectedLease: Lease | null = null;
  updateLeaseId: string = '';
  deleteLeaseId: string = '';
  
  constructor(private apartmentService: ApartmentService) { }

  ngOnInit(): void {
   
    this.loadLeases();
  }

  setActiveView(view: 'create' | 'view' | 'update' | 'delete'): void {
    this.activeView = view;
    this.selectedLease = null;
    this.updateLeaseId = '';
    this.deleteLeaseId = '';
    
    if (view === 'create') {
      this.newLease = this.initializeNewLease();
    }
  }

  initializeNewLease(): Partial<Lease> {
    return {
      leaseNumber: '',
      apartmentNumber: '',
      tenantName: '',
      startDate: '',
      endDate: '',
      monthlyRent: 0,
      securityDeposit: 0,
      leaseterms: '',
      specialTerms: ''
    };
  }

 createLease(): void {
  console.log('New Lease:', this.newLease);


  if (!this.validateLeaseForm(this.newLease)) {
    alert('Please fill in all required fields');
    return;
  }


  const request: Lease = {
    ...this.newLease as Lease
  };

  this.apartmentService.createLease(request).subscribe(
    (newLease: Lease) => {
      this.leases.push(newLease);
      alert('Lease request created successfully!');
      this.newLease = this.initializeNewLease();
      this.loadLeases();
      this.setActiveView('view');
    },
    (error: any) => {
      console.error('Error creating maintenance request:', error);
      alert('An error occurred while creating the maintenance request.');
    }
  );
  }

  updateLease(): void {
    if (!this.selectedLease) {
      return;
    }

    if (!this.validateLeaseForm(this.selectedLease)) {
      alert('Please fill in all required fields');
      return;
    }

    this.apartmentService.updateLease(this.selectedLease.leaseNumber, this.selectedLease).subscribe(
      (updateLease: Lease) => {
        const index = this.leases.findIndex(request => request.leaseNumber === updateLease.leaseNumber);
        if (index !== -1) {
          this.leases[index] = updateLease;
        }
        alert('Lease request updated successfully!');
        this.loadLeases()
        this.selectedLease = null;
        this.updateLeaseId = '';
        this.setActiveView('view');
      },
      (error: any) => {
        console.error('Error updating Lease request:', error);
        alert('An error occurred while updating the Lease request.');
      }
    );
  }

  deleteLease(): void {
    if (!this.selectedLease) {
      return;
    }

    this.apartmentService.deleteLease(this.selectedLease.leaseNumber).subscribe(
      () => {
        this.leases = this.leases.filter(request => request.leaseNumber !== this.selectedLease!.leaseNumber);
        alert('lease request deleted successfully!');
        this.loadLeases()
        this.selectedLease = null;
        this.deleteLeaseId = '';
        this.setActiveView('view');
      },
      (error: any) => {
        console.error('Error deleting lease request:', error);
        alert('An error occurred while deleting the lease request.');
      }
    );
  }


  private validateLeaseForm(request: Partial<Lease>): boolean {
    return !!(
      request.leaseNumber &&
      request.apartmentNumber &&
      request.tenantName &&
      request.startDate &&
      request.endDate &&
      request.monthlyRent &&
      request.securityDeposit &&
      request.leaseterms &&
      request.specialTerms
    );
  }

  loadLeases(): void {
    this.apartmentService.getLease().subscribe(
      (requests: Lease[]) => {
        this.leases = requests;
      },
      (error: any) => {
        console.error('Error loading lease requests:', error);
      }
    );
  }


  onUpdateLeaseSelect(): void {
    if (this.updateLeaseId) {
      const lease = this.leases.find(l => l.leaseNumber === this.updateLeaseId);

      this.selectedLease = lease ? { ...lease } : null;
    } else {
      this.selectedLease = null;
    }
  }

  onDeleteLeaseSelect(): void {
    if (this.deleteLeaseId) {
      const lease = this.leases.find(l => l.leaseNumber === this.deleteLeaseId);

      this.selectedLease = lease ? { ...lease } : null;
    } else {
      this.selectedLease = null;
    }
  }

  selectLeaseForUpdate(lease: Lease): void {
    this.selectedLease = { ...lease };
    this.updateLeaseId = lease.leaseNumber.toString();
    this.setActiveView('update');
  }

  selectLeaseForDelete(lease: Lease): void {
    this.selectedLease = { ...lease };
    this.deleteLeaseId = lease.leaseNumber.toString();
    this.setActiveView('delete');
  }

  cancelUpdate(): void {
    this.selectedLease = null;
    this.updateLeaseId = '';
  }

  cancelDelete(): void {
    this.selectedLease = null;
    this.deleteLeaseId = '';
  }

  isLeaseActive(lease: Lease): boolean {
    const today = new Date();
    const endDate = new Date(lease.endDate);
    return endDate >= today;
  }

}

