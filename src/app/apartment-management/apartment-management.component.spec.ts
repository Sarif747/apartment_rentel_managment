import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentManagementComponent } from './apartment-management.component';

describe('ApartmentManagementComponent', () => {
  let component: ApartmentManagementComponent;
  let fixture: ComponentFixture<ApartmentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApartmentManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApartmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
