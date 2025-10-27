import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root',
})
export class ApartmentService {
    private apiUrl = 'http://localhost:8000/apartment'; 
    private maintenanceUrl = 'http://localhost:8000/maintenance'
    private leaseUrl = 'http://localhost:8000/leases'
    private tenantUrl = 'http://localhost:8000/tenant'
    private apartmentsSubject = new BehaviorSubject<any[]>([]);
    private maintenanceSubject = new BehaviorSubject<any[]>([]);
    private leaseSubject = new BehaviorSubject<any[]>([]);
    private tenantSubject = new BehaviorSubject<any[]>([]);
    apartments$ = this.apartmentsSubject.asObservable();
    maintenance$ = this.maintenanceSubject.asObservable();
    lease$ = this.leaseSubject.asObservable();
    tenant$ = this.tenantSubject.asObservable();
  tenants$: any;

    constructor(private http: HttpClient) {}

    loadApartments() {
        console.log('Loading apartments...');
        this.http.get<any[]>(this.apiUrl).subscribe(
            (data) => {
                this.apartmentsSubject.next(data);
            },
            (error) => {
                console.error('Error fetching apartments:', error);
            }
        );
    }

    loadMaintenance() {
        console.log('Loading maintenance...');
        this.http.get<any[]>(this.maintenanceUrl).subscribe(
            (data) => {
                this.maintenanceSubject.next(data);
            },
            (error) => {
                console.error('Error fetching apartments:', error);
            }
        );
    }

    loadLease() {
        console.log('Loading maintenance...');
        this.http.get<any[]>(this.leaseUrl).subscribe(
            (data) => {
                this.leaseSubject.next(data);
            },
            (error) => {
                console.error('Error fetching apartments:', error);
            }
        );
    }

    loadTenant() {
        console.log('Loading maintenance...');
        this.http.get<any[]>(this.tenantUrl).subscribe(
            (data) => {
                this.leaseSubject.next(data);
            },
            (error) => {
                console.error('Error fetching apartments:', error);
            }
        );
    }

    getApartments(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    getMaintenance(): Observable<any> {
        return this.http.get(this.maintenanceUrl);
    }

    getLease(): Observable<any> {
        return this.http.get(this.leaseUrl);
    }

    getTenant(): Observable<any> {
        return this.http.get(this.tenantUrl);
    }



    getApartmentByNumber(apartmentNumber: string): Observable<any> {
        const url = `${this.apiUrl}/${apartmentNumber}`;
        return this.http.get(url);
    }

    getMaintenanceByNumber(requestNumber: string): Observable<any> {
        const url = `${this.maintenanceUrl}/${requestNumber}`;
        return this.http.get(url);
    }

    getLeaseByNumber(leaseNumber: string): Observable<any> {
        const url = `${this.leaseUrl}/${leaseNumber}`;
        return this.http.get(url);
    }

    getTenantByNumber(tenantId: string): Observable<any> {
        const url = `${this.tenantUrl}/${tenantId}`;
        return this.http.get(url);
    }

    searchApartments(query: string): Observable<any> {
        const url = `${this.apiUrl}/search?search=${query}`;
        console.log('Calling API with URL:', url);
        return this.http.get<any[]>(url).pipe(
            catchError(error => {
                console.error('Error fetching apartments:', error);
                return throwError(error);
            })
        );
    }

    searchTenants(query: string): Observable<any> {
        const url = `${this.tenantUrl}/search?search=${query}`;
        console.log('Calling API with URL:', url);
        return this.http.get<any[]>(url).pipe(
            catchError(error => {
                console.error('Error fetching apartments:', error);
                return throwError(error);
            })
        );
    }
     

    createApartment(apartment: any): Observable<any> {
        return this.http.post(this.apiUrl, apartment, httpOptions);
    }

    createMaintenance(maintenance: any): Observable<any> {
        return this.http.post(this.maintenanceUrl, maintenance, httpOptions);
    }

    createLease(lease: any): Observable<any> {
        return this.http.post(this.leaseUrl, lease, httpOptions);
    }

    createTenant(tenant: any): Observable<any> {
        return this.http.post(this.tenantUrl, tenant, httpOptions);
    }

    updateApartment(apartmentNumber: string, apartment: any): Observable<any> {
        const url = `${this.apiUrl}/${apartmentNumber}`;
        return this.http.put(url, apartment, httpOptions);
    }

    updateMaintenance(requestNumber: string, maintenance: any): Observable<any> {
        const url = `${this.maintenanceUrl}/${requestNumber}`;
        return this.http.put(url, maintenance, httpOptions);
    }

    updateLease(leaseNumber: string, lease: any): Observable<any> {
        const url = `${this.leaseUrl}/${leaseNumber}`;
        return this.http.put(url, lease, httpOptions);
    }

    updateTenant(tenantId: string, lease: any): Observable<any> {
        const url = `${this.tenantUrl}/${tenantId}`;
        return this.http.put(url, lease, httpOptions);
    }

    deleteApartment(apartmentNumber: string): Observable<any> {
        const url = `${this.apiUrl}/${apartmentNumber}`;
        return this.http.delete(url);
    }

    deleteMaintenance(requestNumber: string): Observable<any> {
        const url = `${this.maintenanceUrl}/${requestNumber}`;
        return this.http.delete(url);
    }

    deleteLease(leaseNumber: string): Observable<any> {
        const url = `${this.leaseUrl}/${leaseNumber}`;
        return this.http.delete(url);
    }

    deleteTenant(tenantId: string): Observable<any> {
        const url = `${this.tenantUrl}/${tenantId}`;
        return this.http.delete(url);
    }

    refreshApartments() {
        this.loadApartments();
    }

    refreshMaintenance() {
        this.loadMaintenance();
    }

    refreshLease() {
        this.loadLease();
    }

    refreshTenant() {
        this.loadTenant();
    }
}