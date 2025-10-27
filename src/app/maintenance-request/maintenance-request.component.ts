import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApartmentService } from '../app.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface MaintenanceRequest {
  id: number;
  requestNumber: string;
  apartmentNumber: string;
  tenantName: string;
  issueDescription: string;
  requestDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
}

@Component({
  selector: 'app-maintenance-request',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      CommonModule,
      ReactiveFormsModule,
      HttpClientModule,
      RouterModule,
  ],
  templateUrl: './maintenance-request.component.html',
  styleUrls: ['./maintenance-request.component.css'],
  providers: [
      ApartmentService
  ]
})
export class MaintenanceRequestComponent implements OnInit {

  activeView: 'create' | 'view' | 'update' | 'delete' = 'view';


  maintenanceRequests: MaintenanceRequest[] = [];


  newRequest: Partial<MaintenanceRequest> = this.initializeNewRequest();
  selectedRequest: MaintenanceRequest | null = null;
  updateRequestId: string = '';
  deleteRequestId: string = '';

  constructor(private apartmentService: ApartmentService) { }

  ngOnInit(): void {
    this.loadMaintenanceRequests();
  }


  setActiveView(view: 'create' | 'view' | 'update' | 'delete'): void {
    this.activeView = view;
    this.selectedRequest = null; 
    this.updateRequestId = '';
    this.deleteRequestId = '';

    if (view === 'create') {
      this.newRequest = this.initializeNewRequest();
    }
  }

 
  initializeNewRequest(): Partial<MaintenanceRequest> {
    return {
      requestNumber: '',
      apartmentNumber: '',
      tenantName: '',
      issueDescription: '',
      requestDate: '',
      priority: 'Low',
      status: 'Pending'
    };
  }


  createMaintenanceRequest(): void {
    if (!this.validateRequestForm(this.newRequest)) {
      alert('Please fill in all required fields');
      return;
    }

    const request: MaintenanceRequest = {
      ...this.newRequest as MaintenanceRequest
    };

    this.apartmentService.createMaintenance(request).subscribe(
      (newRequest: MaintenanceRequest) => {
        this.maintenanceRequests.push(newRequest);
        alert('Maintenance request created successfully!');
        this.newRequest = this.initializeNewRequest();
        this.setActiveView('view');
      },
      (error: any) => {
        console.error('Error creating maintenance request:', error);
        alert('An error occurred while creating the maintenance request.');
      }
    );
  }


  updateMaintenanceRequest(): void {
    if (!this.selectedRequest) {
      return;
    }

    if (!this.validateRequestForm(this.selectedRequest)) {
      alert('Please fill in all required fields');
      return;
    }

    this.apartmentService.updateMaintenance(this.selectedRequest.requestNumber, this.selectedRequest).subscribe(
      (updatedRequest: MaintenanceRequest) => {
        const index = this.maintenanceRequests.findIndex(request => request.requestNumber === updatedRequest.requestNumber);
        if (index !== -1) {
          this.maintenanceRequests[index] = updatedRequest;
        }
        alert('Maintenance request updated successfully!');
        this.loadMaintenanceRequests()
        this.selectedRequest = null;
        this.updateRequestId = '';
        this.setActiveView('view');
      },
      (error: any) => {
        console.error('Error updating maintenance request:', error);
        alert('An error occurred while updating the maintenance request.');
      }
    );
}


  deleteMaintenanceRequest(): void {
    if (!this.selectedRequest) {
      return;
    }

    this.apartmentService.deleteMaintenance(this.selectedRequest.requestNumber).subscribe(
      () => {
        this.maintenanceRequests = this.maintenanceRequests.filter(request => request.requestNumber !== this.selectedRequest!.requestNumber);
        alert('Maintenance request deleted successfully!');
        this.loadMaintenanceRequests()
        this.selectedRequest = null;
        this.deleteRequestId = '';
        this.setActiveView('view');
      },
      (error: any) => {
        console.error('Error deleting maintenance request:', error);
        alert('An error occurred while deleting the maintenance request.');
      }
    );
  }


  private validateRequestForm(request: Partial<MaintenanceRequest>): boolean {
    return !!(
      request.requestNumber &&
      request.apartmentNumber &&
      request.tenantName &&
      request.issueDescription &&
      request.requestDate &&
      request.priority &&
      request.status
    );
  }

  loadMaintenanceRequests(): void {
    this.apartmentService.getMaintenance().subscribe(
      (requests: MaintenanceRequest[]) => {
        this.maintenanceRequests = requests;
      },
      (error) => {
        console.error('Error loading maintenance requests:', error);
      }
    );
  }


  onUpdateRequestSelect(): void {
    if (this.updateRequestId) {
      const request = this.maintenanceRequests.find(r => r.requestNumber === this.updateRequestId);
      this.selectedRequest = request ? { ...request } : null;
    } else {
      this.selectedRequest = null;
    }
  }

  onDeleteRequestSelect(): void {
    if (this.deleteRequestId) {
      const request = this.maintenanceRequests.find(r => r.requestNumber === this.deleteRequestId);
      this.selectedRequest = request ? { ...request } : null;
    } else {
      this.selectedRequest = null;
    }
  }

  selectRequestForUpdate(request: any) {
    this.selectedRequest = { ...request };
    this.updateRequestId = request.requestNumber.toString();
    this.setActiveView('update');
  }

 
  selectRequestForDelete(request: MaintenanceRequest): void {
    this.selectedRequest = { ...request };
    this.deleteRequestId = request.requestNumber.toString();
    this.setActiveView('delete');
  }


  cancelUpdate(): void {
    this.selectedRequest = null;
    this.updateRequestId = '';
  }

  cancelDelete(): void {
    this.selectedRequest = null;
    this.deleteRequestId = '';
  }
}